import { Handler } from "@netlify/functions";

// type Order = { "id": "order_DaZlswtdcn9UNV", "entity": "order", "amount": 50000, "amount_paid": 0, "amount_due": 50000, "currency": "INR", "receipt": "Receipt #20", "status": "created", "attempts": 0, "notes": [], "created_at": 1572502745 }

type PaymentBody = {
    paymentId: string, 
    orderId_orig: string,
    orderId_checkout: string,
    signature: string
}

function checkValidity(payment: PaymentBody) {
    // Only for initial testing
    // Verify signature using sha256 hash
    // More info here: https://razorpay.com/docs/payment-gateway/web-integration/custom/#step-5-verify-the-signature
    console.log(payment)

    return payment.orderId_orig === payment.orderId_checkout
}

// const getRZPInstance = () => { 
//     return new Razorpay({
//         key_id: 'rzp_test_od3yQVWQEML7Ta',
//         key_secret: 'qUAtQnTyukmFQY6fuB1dh5iV'
//     })
// }

const handler: Handler = async (event, context) => {
    const paymentResponse: PaymentBody = JSON.parse(event.body)
    console.log("Verifyng payment for ", paymentResponse.paymentId, paymentResponse.orderId_orig)

    return {
        statusCode: 200,
        body: JSON.stringify({ valid: checkValidity(paymentResponse)}),
    };
};

export { handler };