import { Handler } from "@netlify/functions";
import { initializeApp, cert, ServiceAccount }  from 'firebase-admin/app';
import { getFirestore, DocumentReference } from 'firebase-admin/firestore';
import sendgridMail from '@sendgrid/mail';

type VerifyPayload = {
    paymentId: string, 
    orderId_orig: string,
    orderId_checkout: string,
    signature: string
}

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

async function sendEmailReceipt(donation: donation) {
    const msg = {
        to: donation.donor.email_id,
        from: "test@14trees.org",
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamicTemplateData: {
            first_name: donation.donor.first_name,
            trees: donation.contribution.trees,
        }
    }
   await sendgridMail.send(msg);
}

// type Order = { "id": "order_DaZlswtdcn9UNV", "entity": "order", "amount": 50000, "amount_paid": 0, "amount_due": 50000, "currency": "INR", "receipt": "Receipt #20", "status": "created", "attempts": 0, "notes": [], "created_at": 1572502745 }

function checkValidity(payment: VerifyPayload) {
    // Only for initial testing
    // Verify signature using sha256 hash
    // More info here: https://razorpay.com/docs/payment-gateway/web-integration/custom/#step-5-verify-the-signature
    console.log(payment)

    return payment.orderId_orig === payment.orderId_checkout
}

const handler: Handler = async (event, context) => {
    try {
        const verifyPayload: VerifyPayload = JSON.parse(event.body)
        console.log("Verifyng payment for ", verifyPayload.paymentId, verifyPayload.orderId_orig)
    
        let valid: boolean = checkValidity(verifyPayload)
        let emailSent: boolean = false
        let dbUpdated: boolean = false
    
        if (!valid) {
            console.log("Payment is invalid", verifyPayload.orderId_orig)
            return { statusCode: 400, body: "Payment is invalid, please contact support" }
        }
    
        if (valid && verifyPayload.orderId_orig && verifyPayload.orderId_orig.length) {
            initServices()
            const donationRef = getFirestore().collection('donations').doc(verifyPayload.orderId_orig);
            const donationSnap = await donationRef.get();
            if (!donationSnap.exists) {
                console.log('donation not found in firestore: ', verifyPayload.orderId_orig)
                return { statusCode: 404, body: 'Not found in database' }
            } else {
                const donation = donationSnap.data() as donation;
                await donationRef.update({ paymentCaptured: true, paymentId: verifyPayload.paymentId });
                dbUpdated = true;
                await sendEmailReceipt(donation)
                emailSent = true;
            }
        }
    
        return {
            statusCode: 200,
            body: JSON.stringify({ valid, dbUpdated, emailSent }),
        };
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};

export { handler };