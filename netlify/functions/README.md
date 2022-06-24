# Server Functions Documentation

## Order.ts

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
