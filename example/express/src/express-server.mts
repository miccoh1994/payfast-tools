/**
 * NGrok is used to create a publically accessible URL for the local Express server, which is necessary for PayFast to send IPN requests to the server during development and testing.
 * 
 * This server listens for POST requests at the /ipn endpoint, validates incoming payment notifications using the validatePayment function from the @knix/payfast-validation package, and responds accordingly.
 * 
 * Note: This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';

import PayfastExpressApp from '@knix/payfast-express';

if (!process.env.NGROK_AUTHTOKEN) {
  throw new Error('NGROK_AUTHTOKEN is not set. Ngrok tunnel will not work without it.');
}

if (!process.env.PAYFAST_MERCHANT_ID) {
  throw new Error('PAYFAST_MERCHANT_ID is not set. Validation will not work without it.');
}

if (!process.env.PAYFAST_MERCHANT_KEY) {
  throw new Error('PAYFAST_MERCHANT_KEY is not set. Validation will not work without it.');
}

console.log('Starting Express server with the following configuration:');
console.log(`NGROK_AUTHTOKEN: ${process.env.NGROK_AUTHTOKEN ? '****' : 'Not Set'}`);
console.log(`PAYFAST_MERCHANT_ID: ${process.env.PAYFAST_MERCHANT_ID ? '****' : 'Not Set'}`, process.env.PAYFAST_MERCHANT_ID);
console.log(`PAYFAST_MERCHANT_KEY: ${process.env.PAYFAST_MERCHANT_KEY ? '****' : 'Not Set'}`, process.env.PAYFAST_MERCHANT_KEY);
console.log(`PAYFAST_PASSPHRASE: ${process.env.PAYFAST_PASSPHRASE ? '****' : 'Not Set'}`, process.env.PAYFAST_PASSPHRASE);
const app = express();

app.use(PayfastExpressApp({
  sandbox: true, 
  passphrase: process.env.PAYFAST_PASSPHRASE, 
  merchant_id: process.env.PAYFAST_MERCHANT_ID,
  merchant_key: process.env.PAYFAST_MERCHANT_KEY,
  logger: console
}));

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server is running on port ${process.env.PORT || 3333}`);
});
