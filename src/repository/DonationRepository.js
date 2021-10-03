import db from "~/repository/db/firebaseInit";
import {  doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import axios from "axios";

const RAZORPAY_CHECKOUT_URI="https://checkout.razorpay.com/v1/checkout.js"
const FUNCTIONS_MOCKED = false

function all(qSnap) {
	let docs = []
	qSnap.forEach((doc) => {
		docs.push(doc.data())
	});
	return docs
}

function getRazorpayKey() {
	// for initial testing, this is still test key
	// once ready for prod, make this the live key
	return 'rzp_test_od3yQVWQEML7Ta'
}

function createCallbackUrl(orderId) {
	return '/checkout:' + orderId
}

async function verifyPayment(orderId_orig, response) {
	const rzpEndpoint = "/.netlify/functions/verify"

	const verifyPayload = {
		paymentId : response.razorpay_payment_id,
		orderId_orig: orderId_orig,
		orderId_checkout: response.razorpay_order_id,
		signature : response.razorpay_signature
	}
	// Uncomment for actual
	let valid = false 

	if (FUNCTIONS_MOCKED) {
		valid = true
	} else {
		// Fire serverless function to verify payment signature
		let response = await axios.post(rzpEndpoint, verifyPayload)
		if (!response?.data) { throw Error("Something went wrong") }
		console.log(response.data)
		valid = response.data.valid
	}

	if (valid) {
		// Update paymentCaptured field for this order in our database
		const donationRef = doc(db, "donations", orderId_orig);
		await updateDoc(donationRef, {
  			paymentCaptured: true
		});
	}

	return valid
}

async function createRazorpayOrder(formData) {
	const rzpEndpoint = "/.netlify/functions/order"
	if (FUNCTIONS_MOCKED) {
	 	return { 
			orderId: "order_HIJ5xzCQtqR6O3",
			verifiedAmount: 50000,
			orderName: "Test Campaign",
			currency: "INR",
			details: {
				name: "Raju Bhai",
				phone: "1234567890",
				email: "test@example.com"
			}
		}
	}
	else {

		// Production create order from function
		const order = await axios.post(rzpEndpoint, formData)
		if (! order?.data?.orderId) { 
			throw Error("Something went wrong") 
		}
		// Data must have: orderId, verifiedAmount, orderName, currency, (donor) details 
		return order.data
	}
}

export default {
	async get(orderId) {
		const docRef = doc(db, "donations", orderId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
  			return docSnap.data()
		} else {
			return null
		}
	},
	async createOrder(formData) {
		// Create order using serverless function
		const { orderId, verifiedAmount, currency } = await createRazorpayOrder(formData)

		// Mark payment as false and store data in our database even before payment
		formData.paymentCaptured = false
		formData.amount = verifiedAmount
		formData.currency = currency
		formData.date = new Date()

		await setDoc(doc(db, "donations", orderId), formData);
		return orderId
	},

	async collectPayment(paymentData, successHandler, failureHandler) {
		// create handler to verify payment and update paymentStatus in our database
		const onPaymentSuccess = async (response) => { 
			console.log("Success from razorpay", response)
			const verifiedPayment = await verifyPayment(paymentData.orderId, response)
			if (verifiedPayment) 
				successHandler()
			else 
				failureHandler("Payment could not be verified. Please reach out to customer support")
		}

		const onPaymentFailure = (response) => {
			failureHandler(response.error.description)
		}

		const options = {
			key: getRazorpayKey(), // Enter the Key ID generated from the Dashboard
			amount: paymentData.amount,
			currency: paymentData.currency,
			name: "14 Trees Foundation",
			order_id: paymentData.orderId,
			// callback_url: createCallbackUrl(orderId),
			handler: onPaymentSuccess,
			prefill: { name: paymentData.name, email: paymentData.email_id, contact: paymentData.phone},
		}

		// Open razorpay global dialog to capture payment
		let rzp
		if (Razorpay) {
			rzp = new Razorpay(options).open()
			rzp.on('payment.failed', onPaymentFailure);
		}
		else {
			let razorpayCheckout = document.createElement('script')
			razorpayCheckout.setAttribute('src', RAZORPAY_CHECKOUT_URI)
			document.head.appendChild(razorpayCheckout)
			rzp = new Razorpay(options).open()
			rzp.on('payment.failed', onPaymentFailure);
		}
	},
	async update() {

	},
};