import { Handler } from "@netlify/functions";
import { initializeApp, cert }  from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

type FormData = {
    contribution: {
        paymentCaptured: boolean,
        amount: number,
        currency: 'INR' | 'USD',
        date: Date,
        campaign: string,
        trees: number,
    }
    donor: {
        first_name: string,
        last_name: string,
        email_id: string,
        phone: string,
        currency: string,
        interest: {
            csr: boolean,
            visit: boolean,
            volunteer: boolean,
        },
        notifications: {
            updates: boolean,
            newsletter: boolean
        }
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
        notes: Array<any>,
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

function addDonation(id: string) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        }),
        // databaseURL: `https://${DATABASE_NAME}.firebaseio.com` // not required for firestore?
    });
    return getFirestore().collection('donations').doc(id)
}

function createDonationObject(payment: RazorpayPayment, fields: Array<any>) {
    let donation: FormData['contribution'] = {
        paymentCaptured: true,
        amount: payment.amount,
        currency: payment.currency,
        date: new Date(),
        campaign: "iitk-djc",
        trees: fields[0].value,
    }
    return donation
}

const handler: Handler = async (event: any) => {
    const payload : RazorpayEvent = JSON.parse(event.body)
    if (payload.event === 'payment.captured' && payload.contains.includes('payment')) {
        const payment : RazorpayPayment = payload.payload?.payment.entity
        if (payment && payment.captured) {
            console.log(payment.notes)

        // TODO: formData to firestore incl orderId
        const donationRef = addDonation("id");
        await donationRef.set(createDonationObject(payment, payment.notes))
        }
    }
    
    return {
        statusCode: 200,
    };
};

export { handler }; 