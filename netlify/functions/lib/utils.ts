import { initializeApp, cert, ServiceAccount, getApps } from 'firebase-admin/app';
import sendgridMail from '@sendgrid/mail';
import Razorpay from 'razorpay';
import { getFirestore } from 'firebase-admin/firestore';
import { donation, donor, EmailAttachment, InvoiceOptions, RazorpayPayment } from "./model";
const fetch = require('node-fetch')

export async function generateInvoice (opts: InvoiceOptions) {
    // https://invoice-generator.com/developers#custom-fields
    const invoice_options = {
        // Data fields
        logo: `${process.env.URL}/logo.png`,
        from: "14 Trees Foundation\nAddress Line 1\nAddress Line 2\n14trees.org",
        to: opts.name,
        ship_to: opts.pan,
        items: [{
            name: "Plant a tree on 14 Trees",
            quantity: opts.quantity,
            unit_cost: opts.rate
        }],

        // Template Fields
        to_title: "Donor",
        header: "Donation Receipt",
        ship_to_title: "PAN Number",
        payment_terms_title: "Receipt Number",
        currency: "inr",
        balance_title: "Contribution Amount",
        number: opts.invoice_number,
        notes: "Thank you for contributing to 14 Trees!",
        terms: "<Terms and Conditions>"
    }

    const response = await fetch("https://invoice-generator.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(JSON.stringify(invoice_options)).toString()
        },
        body: JSON.stringify(invoice_options),
    })

    return response.arrayBuffer()
};

export function initServices() {
    if (getApps().length === 0) {
        const firebaseSecrets: ServiceAccount = {
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        }
        // databaseURL: `https://${DATABASE_NAME}.firebaseio.com` // not required for firestore?
        initializeApp({ credential: cert(firebaseSecrets) });
    }
    sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmailReceipt(to: string, donation: donation, attachments: EmailAttachment[], context: "test" | "prod" = "test") {
    const msg = {
        to: to,
        from: context === "test" ? "test@14trees.org" : "contact@14trees.org",
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        attachments: attachments,
        dynamicTemplateData: {
            first_name: donation.donor.first_name,
            trees: donation.contribution.trees,
        }
    }
    await sendgridMail.send(msg);
}

export function getRZPInstance(ctx: "test" | "prod") { 
    // live get from env variables
    const cred = ctx === "prod" ? 
        { key_id: process.env.RZP_KEY, key_secret: process.env.RZP_SECRET } 
        : { key_id: 'rzp_test_od3yQVWQEML7Ta', key_secret: 'qUAtQnTyukmFQY6fuB1dh5iV' }
    return new Razorpay(cred)
}

export /*
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

export function createDonorObject(payment: RazorpayPayment): donor {
    const fields: {[key: string]: string} = payment.notes;
    console.log(fields)

    const splitNames = (obj: {[key: string]: string}) => {
        if (obj.first_name && obj.last_name) {
            return [obj.first_name, obj.last_name]
        } else if (obj.full_name) {
            return obj.full_name.split(' ')
        } else return ['', ''] 
    }

    let [first_name, last_name] = splitNames(fields)

    return {
        email_id: fields.email,
        phone: fields.phone,
        first_name, last_name,
        address: fields.address,
        region: payment.currency === 'INR' ? 'india' : 'foreign',
    }
}

function calcNumberOfTrees(amount: number, currency: 'INR' | 'USD') {
    if (currency === 'INR') {
        return Math.floor(amount / 300000)
    }
    return Math.floor(amount / 40)
}