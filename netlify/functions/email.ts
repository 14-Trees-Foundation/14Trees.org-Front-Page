import { Handler } from "@netlify/functions";
import { getFirestore } from 'firebase-admin/firestore';
import { sendEmailReceipt, initServices, generateInvoice } from "./lib/utils";
import { donation } from "./lib/model";

type Email = {
	orderId? : string,
	to?: string,
}

const handler: Handler = async (event: { body: string; }, ctx: any) => {
    let context : "prod" | "test" = process.env.CONTEXT === "production" ? "prod" : "test"
	try {
		const emailPayload: Email = JSON.parse(event.body)

		initServices()
		const donationRef = getFirestore().collection('donations').doc(emailPayload.orderId);
		const donationSnap = await donationRef.get();
		if (!donationSnap.exists) {
			console.log('donation not found in firestore: ', emailPayload.orderId)
			return {
				statusCode: 404,
				body: 'Not found in database'
			}
		} else {
			const donation = donationSnap.data() as donation;
			const name = donation.donor.first_name + ' ' + donation.donor.last_name;
			const pdfBytes = await generateInvoice({
				name, pan: donation.donor.pan,
				invoice_number: emailPayload.orderId,
				rate: 3000, quantity: donation.contribution.trees,
			});

			await sendEmailReceipt(emailPayload.to || donation.donor.email_id,
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

		return {
			statusCode: 200
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