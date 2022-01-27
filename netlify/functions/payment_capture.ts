import { Handler } from "@netlify/functions";
import { initializeApp, cert, ServiceAccount }  from 'firebase-admin/app';
import { getFirestore, DocumentReference } from 'firebase-admin/firestore';
import sendgridMail from '@sendgrid/mail';

type donation = {
    paymentCaptured: boolean,
    campaign: string,
    source: string,
    contribution: {
        trees: number,
        amount: number,
        currency: 'INR' | 'USD',
        date: Date,
    }
    donor: {
        first_name?: string,
        last_name?: string,
        email_id: string,
        phone: string,
        ref: DocumentReference,
    }
}

type donor = {
    email_id: string,
    phone: string,
    region: string,
    first_name?: string,
    last_name?: string,
    interest?: {
        csr: boolean,
        visit: boolean,
        volunteer: boolean,
    },
    notifications?: {
        updates: boolean,
        newsletter: boolean
    }
}


type firebaseSecrets = {
    "project_id": string, // FIREBASE_ADMIN_PROJECT_ID
    "private_key_id": string, // FIREBASE_ADMIN_KEY_ID
    "private_key": string, // FIREBASE_ADMIN_PRIVATE_KEY
    "client_email": string, // FIREBASE_ADMIN_CLIENT_EMAIL
    "client_id": string, // FIREBASE_ADMIN_CLIENT_ID
}

type RazorpayEvent = {
    entity: string,
    account_id: string,
    event: 'payment.captured' | 'payment.authorised',
    contains: string[],
    payload: { [key:string] : { entity: RazorpayPayment } },
    created_at: number
}

type RazorpayPayment = {
        id: string,
        entity: string,
        amount: number,
        currency: 'INR' | 'USD',
        status: 'captured' | 'failed',
        order_id: string,
        invoice_id: string,
        international: boolean,
        method: string,
        amount_refunded: number,
        refund_status: string,
        captured: boolean,
        description: string,
        card_id: string,
        bank: string,
        wallet: string,
        vpa: string,
        email: string,
        contact: number,
        notes: {[key: string]: string},
        fee: number,
        tax: number,
        error_code: string,
        error_description: string,
        error_source: string,
        error_step: string,
        error_reason: string,
        acquirer_data: {
          rrn: number 
        },
        created_at: number
}

function initServices() {
    const firebaseSecrets: ServiceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    }
    // databaseURL: `https://${DATABASE_NAME}.firebaseio.com` // not required for firestore?
    initializeApp({ credential: cert(firebaseSecrets) });
    sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
}

function calcNumberOfTrees(amount: number, currency: 'INR' | 'USD') {
    if (currency === 'INR') {
        return Math.floor(amount / 300000)
    }
    return Math.floor(amount / 40)
}

/*
    This function creates a new donation document in the firestore database. 
    It also updates the donor document with the user details.
    fields array comes from Razorpay notes. This will be different for different payment forms
    fields: [
        'email'
        'phone'
        ...custom fields
    ]
*/
function createDonationObject(payment: RazorpayPayment): donation {
    const fields: {[key: string]: string} = payment.notes;

    let contribution: donation['contribution'] = {
        amount: payment.amount,
        currency: payment.currency,
        date: new Date(),
        trees: calcNumberOfTrees(payment.amount, payment.currency),
    }
    return {
        campaign: 'iitk-djc',
        source: 'terre-razorpay',
        paymentCaptured: payment.status === 'captured',
        contribution,
        donor: {
            email_id: fields.email,
            phone: fields.phone,
            ref: getFirestore().doc(`donors/${fields.email}`),
        }
    }
}

function createDonorObject(payment: RazorpayPayment): donor {
    const fields: {[key: string]: string} = payment.notes;

    return {
        email_id: fields.email,
        phone: fields.phone,
        region: payment.currency === 'INR' ? 'india' : 'foreign',
    }
}

async function sendEmailReceipt(payment: RazorpayPayment, donation: donation) {
    const msg = {
        to: payment.email,
        from: "test@14trees.org",
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamicTemplateData: {
            trees: donation.contribution.trees,
        }
        // subject: "[ Test ] Thank you for your donation",
        // text: "Thank you for your donation. This is a test",
        // html: "<strong>Thank you for your donation. This is a test</strong>"
    }
    const response = await sendgridMail.send(msg);
    console.log(response)
}

const handler: Handler = async (event: any) => {
    const payload : RazorpayEvent = JSON.parse(event.body)
    console.log(JSON.stringify(payload))

    if (payload.event === 'payment.captured' && payload.contains.includes('payment')) {
        const payment : RazorpayPayment = payload.payload?.payment.entity
        if (payment && payment.captured) {
            initServices()
            const donorRef = getFirestore().collection('donors').doc(payment.email)
            await donorRef.set(createDonorObject(payment))
            
            const donationRef = getFirestore().collection('donations').doc(payment.id);
            const donation = createDonationObject(payment)
            await donationRef.set(donation)
            
            await sendEmailReceipt(payment, donation)
        }
    }
    
    return {
        statusCode: 200,
    };
};

export { handler }; 