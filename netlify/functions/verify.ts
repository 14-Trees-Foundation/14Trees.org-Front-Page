import { Handler } from "@netlify/functions";
import { getFirestore } from 'firebase-admin/firestore';
import { sendEmailReceipt, initServices, generateInvoice,  } from "./lib/utils";
import { donation } from "./lib/model";

type VerifyPayload = {
    paymentId: string, 
    orderId_orig: string,
    orderId_checkout: string,
    signature: string
}

// type Order = { "id": "order_DaZlswtdcn9UNV", "entity": "order", "amount": 50000, "amount_paid": 0, "amount_due": 50000, "currency": "INR", "receipt": "Receipt #20", "status": "created", "attempts": 0, "notes": [], "created_at": 1572502745 }
function checkValidity(payment: VerifyPayload) {
    // Only for initial testing
    // Verify signature using sha256 hash
    // More info here: https://razorpay.com/docs/payment-gateway/web-integration/custom/#step-5-verify-the-signature
    console.log(payment)

    return payment.orderId_orig === payment.orderId_checkout
}

const handler: Handler = async (event, ctx) => {
    let context: "test" | "prod" = process.env.CONTEXT === "production" ? "prod" : "test"
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
                dbUpdated = true;
                const name = donation.donor.first_name + ' ' + donation.donor.last_name;
                const pdfBytes = await generateInvoice({
                    name, pan: donation.donor.pan,
                    invoice_number: verifyPayload.orderId_orig,
                    rate: 3000, quantity: donation.contribution.trees,
                });

                await sendEmailReceipt(donation.donor.email_id,
                    donation, [{ 
                        content: Buffer.from(pdfBytes).toString("base64"),
                        filename: `RECEIPT_${name.replace(" ", "_")}-14Trees.pdf`,
                        type: "application/pdf",
                        disposition: "attachment"
                    }],
                    context
                )
                emailSent = true;
                await donationRef.update({ 
                    emailSent,
                    paymentCaptured: true,
                    paymentId: verifyPayload.paymentId,
                });
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