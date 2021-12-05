import Razorpay from 'razorpay';
import { Handler } from "@netlify/functions";
import { type } from 'os';


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
    orderId: string,
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

function getRZPInstance() { 
    return new Razorpay({
        key_id: 'rzp_test_od3yQVWQEML7Ta',
        key_secret: 'qUAtQnTyukmFQY6fuB1dh5iV'
    })
}

const handler: Handler = async (event, context) => {
    const formData :FormData = JSON.parse(event.body)
    const orderNotes = { trees: formData.trees }

    let amount = formData.trees * 350000
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
                console.log(order)
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
                    console.log(order)
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


    // TODO: formData to firestore incl orderId
    return {
        statusCode: responseBody === null ? 503 : 200,
        body: JSON.stringify(responseBody),
    };
};

export { handler };