import Razorpay from 'razorpay';
import { Handler } from "@netlify/functions";
import { type } from 'os';

// type Order = { "id": "order_DaZlswtdcn9UNV", "entity": "order", "amount": 50000, "amount_paid": 0, "amount_due": 50000, "currency": "INR", "receipt": "Receipt #20", "status": "created", "attempts": 0, "notes": [], "created_at": 1572502745 }

type ResponseBody = {
    orderId: string,
    verifiedAmount: number
    currency: string,
    details?: {
        name: string,
        email: string,
        contact: string
    }
}

type FormData = {
    first_name: string,
    last_name: string,
    email_id: string,
    phone: string,
    location: string,
    campaign: string,
    trees: number,
    names: Array<string>,
    csr: boolean,
    visit: boolean,
    volunteer: boolean,
    updates: boolean,
    newsletter: boolean
}

const getRZPInstance = () => { 
    return new Razorpay({
        key_id: 'rzp_test_od3yQVWQEML7Ta',
        key_secret: 'qUAtQnTyukmFQY6fuB1dh5iV'
    })
}

const handler: Handler = async (event, context) => {
    const formData:FormData = JSON.parse(event.body)
    const orderNotes = { trees: formData.trees }

    let amount = formData.trees * 350000
    let options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        notes: orderNotes
    };
    const instance = getRZPInstance()
    let responseBody: ResponseBody = null

    await instance.orders.create(options, function (err, order) {
        if (err) console.log(err)
        if (order) {
            console.log(order)
            responseBody = { 
                orderId: order.id, 
                verifiedAmount: amount, 
                currency: options.currency, 
            }
        }
    });

    // TODO: formData to firestore incl orderId
    return {
        statusCode: responseBody === null ? 503 : 200,
        body: JSON.stringify(responseBody),
    };
};

export { handler };