
# Serverless Functions Documentation

## Order.ts

```typescript
type OrderData = {
    orderId: string,
    trees: number,
    currency?: string,
}
```

Called when a user clicks starts the payment process from the UI. 
Creates a new [Razorpay Order](https://razorpay.com/docs/payments/orders/) if no orderId is specified, or fetches Order details from Razorpay if orderId is specified. 

The payment amount and currency. is calculated here.

```typescript
let amount = formData.trees * 300000 // in paise 
let options = {
    amount: amount,  // amount in the smallest currency unit (paise)
    currency: "INR",
};

responseBody = { 
    orderId: order.id, 
    verifiedAmount: amount, 
    currency: options.currency, 
}
```

## Verify.ts

```typescript
type OrderData = {
    orderId: string,
    trees: number,
    currency?: string,
}
```

Called after a payment is completed from the UI. 
Razorpay provides a payment ID and a hash which we can verify from our backend to verify the authenticity of the payment. 
(This is still a WIP)
After verification is complete, we mark store the payment ID in Firestore Donation DB, and add the data to our Google Sheet which is responsible for email and receipt generation.

```typescript
// Add to google sheets
await addToSheet(doc, { 
    Date: donation.contribution.date.toDate().toLocaleDateString(),
    Name: name,
    Email: donation.donor.email_id,
    PAN: donation.donor.pan,
    Amt: donation.contribution.amount / 100,
    Mode: "Online: Razorpay",
    OrderId: verifyPayload.orderId_orig,
})

emailSent = true;

// Update in Firestore
await donationRef.update({ 
    emailSent,
    paymentCaptured: true,
    paymentId: verifyPayload.paymentId,
});
```


## payment_capture.ts

This function serves as a webhook. and is called after the user completed the payment from Razorpay Payment Pages (from Terre's Razorpay account). 
We extract the notes from the webhook payload and save the payment details and donor details to our Donations DB in Firestore.

```typescript
const donorRef = getFirestore().collection('donors').doc(payment.email)
const donationRef = getFirestore().collection('donations').doc(payment.id);
```
