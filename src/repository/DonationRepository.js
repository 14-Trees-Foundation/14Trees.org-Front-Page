import db from "~/repository/db/firebaseInit";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import axios from "axios";

/**
 * Donation Repository DB Schema
 * 
 * Campaigns: (campaignId : string [matching ContentfulCampaign: id])
 * 		name: string
 * 		Donations: collection
 * 		
 * Campaigns/Donations: (orderId: string [matching razorpay orderId])
 *  	paymentCaptured: boolean,
 * 		source: string (14trees-web/terre/google-forms/test/etc),
 *  	contribution: {
 *  		amount: number,
 * 			currency: 'INR' | 'USD',
 * 			date: Date,
 * 			trees: number,
 * 		}
 * 		donor: {
 * 			first_name: string,
 * 			last_name: string,
 * 			email_id: string,
 * 			phone: string,
 * 			Donor: reference (Donors/email_id)
 * 		}
 *
 * Donors: (email_id: string)
 * 		first_name: string,
 * 		last_name: string,
 * 		email_id: string,
 * 		phone: string,
 * 		currency: string,
 * 		interest: {
 * 			csr: boolean,
 * 			visit: boolean,
 * 			volunteer: boolean,
 * 		},
 * 		notifications: {
 * 			updates: boolean,
 * 			newsletter: boolean
 * 		}
 */


const RAZORPAY_CHECKOUT_URI="https://checkout.razorpay.com/v1/checkout.js"

async function verifyPayment(orderId_orig, response) {
	const rzpEndpoint = "/.netlify/functions/verify"

	const verifyPayload = {
		paymentId : response.razorpay_payment_id,
		orderId_orig: orderId_orig,
		orderId_checkout: response.razorpay_order_id,
		signature : response.razorpay_signature
	}
	// Fire serverless function to verify payment signature
	let verify_response = await axios.post(rzpEndpoint, verifyPayload)
	if (!verify_response?.data) { throw Error("Something went wrong") }
	console.log(verify_response.data)

	if (verify_response.data.valid) {
		// Update paymentCaptured field for this order in our database
		const donationRef = doc(db, "donations", orderId_orig);
		await updateDoc(donationRef, { paymentCaptured: true });
	}

	return verify_response.data.valid;
}

/** 
 * @param {object} orderData 
 * @param {string} orderId - orderId from razorpay, a new orderId is generated if not provided
 * Calls the order.ts serverless function
 * Creates/fetches Razorpay order and returns the orderId
 * The amount is calculated in the function based on the number of trees and currency
 */
async function createRazorpayOrder(orderData, orderId = null) {
	const ORDER_ENDPOINT = "/.netlify/functions/order"
	const order = await axios.post(ORDER_ENDPOINT, {orderId, ...orderData})
	if (! order?.data?.orderId) { 
		throw Error("Something went wrong") 
	}
	// Data must have: orderId, verifiedAmount, orderName, currency, (donor) details 
	return order.data
}

/**
 * @param {string} orderId - orderId from razorpay used as primary key for donation
 * @param {object} formData - all fields from the donation form
 */
async function saveFirestoreUserAndDonation(orderId, formData) {
	console.log(formData)
	if (orderId && formData.donor?.email_id && formData.contribution?.campaign) {
		const campaignId = formData.contribution.campaign
		// await setDoc(doc(db, "donations", orderId), formData.contribution);
		await setDoc(doc(db, "campaigns", campaignId, "donations", orderId), formData.contribution);
		await setDoc(doc(db, "donors", formData.donor.email_id), formData.donor);
	} else {
		throw new Error("Fields missing")
	} 
}

export default {
	/**
	 * @param {string} orderId - orderId from razorpay used to fetch the filled formdata from firestore
	 */
	async get(orderId) {
		const docRef = doc(db, "donations", orderId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
  			return docSnap.data()
		} else {
			return null
		}
	},

	/**
	 * Create a new razorpay order and return the orderId
	 * @param {string} updateOrderId - existing orderId to update. If not specified, a new order is created
	 */
	async createOrder(formData, updateOrderId = null) {
		if (! formData.contribution || !formData.donor) return null

		// Create order using serverless function
		const { orderId, verifiedAmount, currency } = await createRazorpayOrder(formData.contribution, updateOrderId)
		// let orderId = "test123", verifiedAmount = 0, currency = "inr" // test only

		if (orderId) {
			// Mark payment as false and store data in our database even before payment
			formData.contribution.paymentCaptured = false
			formData.contribution.amount = verifiedAmount
			formData.contribution.currency = currency
			formData.contribution.date = new Date()
	
			await saveFirestoreUserAndDonation(orderId, formData)
			return orderId
		} else return null
	},

	/**
	 * @param {object} orderData - orderId, amount, currency, name, email, phone, used to prefill fields
	 * @param {*} successHandler 
	 * @param {*} failureHandler 
	 * Triggers the Razorpay checkout modal with the donor details prefilled
	 * Calls the success/failure handlers if specified
	 */
	async collectPayment(orderData, successHandler, failureHandler) {
		// create handler to verify payment and update paymentStatus in our database
		const onPaymentSuccess = async (response) => { 
			if (await verifyPayment(orderData.orderId, response)) 
				successHandler()
			else 
				failureHandler("Payment could not be verified. Please reach out to support.")
		}

		const onPaymentFailure = (response) => {
			failureHandler(response.error.description)
		}

		const options = {
			key: getRazorpayKey(), // Enter the Key ID generated from the Dashboard
			amount: orderData.amount,
			currency: orderData.currency,
			name: "14 Trees Foundation",
			order_id: orderData.orderId,
			// callback_url: createCallbackUrl(orderId),
			handler: onPaymentSuccess,
			prefill: { name: orderData.name, email: orderData.email_id, contact: orderData.phone},
		}

		// Open razorpay global dialog to capture payment
		if (!Razorpay) createRZPInstance()
		const rzp = new Razorpay(options).open()
		rzp.on('payment.failed', onPaymentFailure);
	}
};


// Utility functions

function createRZPInstance() {
	const razorpayCheckout = document.createElement('script')
	razorpayCheckout.setAttribute('src', RAZORPAY_CHECKOUT_URI)
	document.head.appendChild(razorpayCheckout)
}

function all(qSnap) {
	let docs = []
	qSnap.forEach((doc) => {
		docs.push(doc.data())
	});
	return docs
}

function getRazorpayKey(mode = 'test') {
	if (mode === 'test')
		return 'rzp_test_od3yQVWQEML7Ta'
	// if (mode === 'terre')
	// 	return 'rzp_live_suDBmsBep11zB3'
	if (mode === 'live')
		return 'rzp_live_xxxxxxxxxxxxxx'
}