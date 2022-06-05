import { Handler } from "@netlify/functions";
import { getRZPInstance } from "./lib/utils"

type ResponseBody = {
    orderId: string,
    verifiedAmount: number
    currency: string,
}

type OrderData = {
    orderId: string,
    trees: number,
    currency?: string,
}

const handler: Handler = async (event, ctx) => {
    let context : "prod" | "test" = process.env.CONTEXT === "production" ? "prod" : "test"
    const formData: OrderData = JSON.parse(event.body)
    const orderNotes = { trees: formData.trees, source: '14trees-web' }

    let amount = formData.trees * 300000 // in paise 
    let options = {
        amount: amount,  // amount in the smallest currency unit (paise)
        currency: "INR",
        notes: orderNotes
    };
    const instance = getRZPInstance(context)

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