import { Request } from 'express';
import { confirmWithServer } from './confirm-with-server';
import { verifyAmount } from './verify-amount';
import { verifyOrigin } from './verify-origin';
import { verifySignature } from './verify-signature';

export interface IValidatePaymentOptions {
  yourAmount: number;
  passphrase?: string;
  sandbox?: boolean;
}
export async function validatePayment(
  req: Request,
  { yourAmount, passphrase, sandbox }: IValidatePaymentOptions
) {
  try {
    const sig = req.body.signature;
    const validSignature = verifySignature(sig, req.body, passphrase);
    const validIp = await verifyOrigin(req);
    const validData = verifyAmount(yourAmount, req.body.amount_gross);
    const host = sandbox === true ? 'sandbox.payfast.co.za' : 'payfast.co.za';
    const serverConfirmed = await confirmWithServer(host, req.body, passphrase);

    if (
      validSignature === true &&
      validIp === true &&
      validData === true &&
      serverConfirmed === true
    ) {
      return true;
    }
    console.error('[payfast]: failed to validate payment');
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}
