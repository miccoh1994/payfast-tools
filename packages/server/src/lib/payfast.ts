import { confirmWithServer } from './confirm-with-server';
import { verifyAmount } from './verify-amount';
import { verifyOrigin } from './verify-origin';
import { verifySignature } from './verify-signature';
import type { ISignatureInput } from '@miccoh/payfast-core';

export interface IValidatePaymentOptions {
  yourAmount: number;
  passphrase?: string;
  sandbox?: boolean;
}
export async function validatePayment(
  {
    xForwardedForHeader,
    signature,
    payload,
  }: {
    xForwardedForHeader: string;
    signature?: string;
    payload: ISignatureInput;
  },
  { yourAmount, passphrase, sandbox }: IValidatePaymentOptions
) {
  try {
    const validSignature = verifySignature(signature, payload, passphrase);
    const validIp = await verifyOrigin(xForwardedForHeader);
    const validData = verifyAmount(yourAmount, payload.amount_gross);
    const host = sandbox === true ? 'sandbox.payfast.co.za' : 'payfast.co.za';
    const serverConfirmed = await confirmWithServer(host, payload, passphrase);

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
