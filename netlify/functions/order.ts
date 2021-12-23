import Razorpay from 'razorpay';
import { Handler } from "@netlify/functions";

type ResponseBody = {
    orderId: string,
    verifiedAmount: number
    currency: string,
}

type OrderData = {
    orderId: string,
    trees: number,
    currency?: string,
    // first_name: string,
    // last_name: string,
    // email_id: string,
    // phone: string,
}

function getRZPInstance() { 
    // live get from env variables
    return new Razorpay({
        key_id: process.env.RZP_KEY || 'rzp_test_od3yQVWQEML7Ta',
        key_secret: process.env.RZP_SECRET || 'qUAtQnTyukmFQY6fuB1dh5iV'
    })
}

const handler: Handler = async (event, context) => {
    const formData: OrderData = JSON.parse(event.body)
    const orderNotes = { trees: formData.trees, source: '14trees-web' }

    let amount = formData.trees * 300000 // in paise 
    let options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        notes: orderNotes
    };
    const instance = getRZPInstance()
    let responseBody: ResponseBody = null

    if (! formData.orderId) {
        await instance.orders.create(options, function (err, order) {
            if (err) console.log(err)
            if (order) {
                responseBody = { 
                    orderId: order.id, 
                    verifiedAmount: amount, 
                    currency: options.currency, 
                }
            }
        });
    } else {
        try {
            let order = await instance.orders.fetch(formData.orderId)
            if (order) {
                if (order) {
                    responseBody = { 
                        orderId: order.id, 
                        verifiedAmount: amount, 
                        currency: options.currency, 
                    }
                }
            };
        } catch (err) {
            console.log(err)
        }
    }

    return {
        statusCode: responseBody === null ? 503 : 200,
        body: JSON.stringify(responseBody),
    };
};

export { handler };