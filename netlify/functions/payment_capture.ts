import { Handler } from "@netlify/functions";
import { initServices, sendEmailReceipt, createDonationObject, createDonorObject, generateInvoice } from "./lib/utils";
import { getFirestore } from "firebase-admin/firestore";
import { RazorpayEvent, RazorpayPayment, donation } from "./lib/model";

const handler: Handler = async (event, ctx) => {
    let context : "prod" | "test" = process.env.CONTEXT === "production" ? "prod" : "test"
    const payload : RazorpayEvent = JSON.parse(event.body)

    if (payload.event === 'payment.captured' && payload.contains.includes('payment')) {
        const payment : RazorpayPayment = payload.payload?.payment.entity
        if (payment && payment.captured) {
            initServices()
            const donorRef = getFirestore().collection('donors').doc(payment.email)
            const donationRef = getFirestore().collection('donations').doc(payment.id);

            const donationSnap = await donationRef.get();
            if (donationSnap.exists && donationSnap.data) {
			    const donation = donationSnap.data() as donation;
                // payment has been processed directly from website
                if (donation.source === "14trees-web" || donation.emailSent) 
                    return { statusCode: 200 };
            } else {
                await donorRef.set(createDonorObject(payment))
                const donation = createDonationObject(payment)
                await donationRef.set(donation)
                
                const name = donation.donor.first_name + ' ' + donation.donor.last_name;
                const pdfBytes = await generateInvoice({
                    name, pan: donation.donor.pan,
                    invoice_number: payment.id,
                    rate: 3000, quantity: donation.contribution.trees,
                });
    
                await sendEmailReceipt(payment.email || donation.donor.email_id,
                    donation, [{ 
                        content: Buffer.from(pdfBytes).toString("base64"),
                        filename: `RECEIPT_${name.replace(" ", "_")}-14Trees.pdf`,
                        type: "application/pdf",
                        disposition: "attachment"
                    }],
                    context
                )
                await donationRef.update({ emailSent: true });
            }
        }
    }
    
    return {
        statusCode: 200,
    };
};

export { handler }; 