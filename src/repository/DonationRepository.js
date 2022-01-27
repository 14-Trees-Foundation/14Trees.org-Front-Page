import db from "~/repository/db/firebaseInit";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import axios from "axios";

/*  Donation Repository DB Schema
 		
 Donations: (orderId: string [matching razorpay orderId])
	campaign: string (matching contentful campaign-id),
  	paymentCaptured: boolean,
 	source: string (14trees-web/terre/google-forms/test/etc),
	names: Array<string>, // names of the people on behalf of
  	contribution: {
		trees: number,
  		amount: number,
		currency: 'INR' | 'USD',
		date: Date,
	}
	donor: {
		first_name: string,
		last_name: string,
		email_id: string,
		phone: string,
		Donor: reference (Donors/email_id)
	}

 Donors: (email_id: string)
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
async function saveToFirestore(orderId, donation, donor) {
	if (orderId && donor?.email_id && donation?.campaign) {
		await setDoc(doc(db, "donors", donor.email_id), donor);
		donor.Donor = `donors/${donor.email_id}`;
		await setDoc(doc(db, "donations", orderId), donation);
	} else {
		throw new Error("Fields missing")
	} 
}

export default {
	/**
	 * @param {string} orderId - orderId from razorpay used to fetch the filled formdata from firestore
	 */
	async get(orderId) {
		console.log("Fetching donation data for orderId: ", orderId)
		const docSnap = await getDoc(doc(db, "donations", orderId));
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
		// let orderId = "test123", verifiedAmount = 3300, currency = "INR"; // test only
		const { orderId, verifiedAmount, currency } = await createRazorpayOrder(formData.contribution, updateOrderId)

		if (orderId) {
			// Mark payment as false and store data in our database even before payment

			const contribution = {
				paymentCaptured : false,
				campaign: formData.contribution.campaign,
				names: formData.contribution.names,
				source: "14trees-web",
				contribution: {
					trees: formData.contribution.trees,
					amount: verifiedAmount,
					currency : currency,
					date : new Date()
				},
				donor: {
					first_name: formData.donor.first_name,
					last_name: formData.donor.last_name,
					email_id: formData.donor.email_id,
					phone: formData.donor.phone,
				}
			}
			await saveToFirestore(orderId, contribution, formData.donor)
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
			prefill: orderData.donorDetails,
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