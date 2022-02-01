import { DocumentReference } from 'firebase-admin/firestore';

export type EmailAttachment = {
    content: any;
    filename: string;
    type: string;
    disposition: string;
}

export type InvoiceOptions = { 
    name: string; 
    pan: string; 
    quantity: number; 
    rate: number; 
    invoice_number: string;
}

export type donation = {
    paymentCaptured: boolean,
    campaign: string,
    source: "14trees-web" | "terre-razorpay",
    emailSent: boolean,
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
        address?: string,
        pan?: string,
        phone: string,
        ref: DocumentReference,
    }
}

export type donor = {
    email_id: string,
    phone: string,
    region: string,
    first_name?: string,
    last_name?: string,
    address?: string,
    zipcode?: string,
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

export type firebaseSecrets = {
    "project_id": string, // FIREBASE_ADMIN_PROJECT_ID
    "private_key_id": string, // FIREBASE_ADMIN_KEY_ID
    "private_key": string, // FIREBASE_ADMIN_PRIVATE_KEY
    "client_email": string, // FIREBASE_ADMIN_CLIENT_EMAIL
    "client_id": string, // FIREBASE_ADMIN_CLIENT_ID
}

export type RazorpayEvent = {
    entity: string,
    account_id: string,
    event: 'payment.captured' | 'payment.authorised',
    contains: string[],
    payload: { [key:string] : { entity: RazorpayPayment } },
    created_at: number
}

export type RazorpayPayment = {
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