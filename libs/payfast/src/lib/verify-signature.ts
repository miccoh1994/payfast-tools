import { ISignatureInput } from '@za-payments/react-payfast';
import { generateSignature } from '..';
export function verifySignature(
  inputSignature: string,
  requestData: ISignatureInput,
  passphrase?: string
) {
  const signature = generateSignature(requestData, passphrase);
  if (signature === inputSignature) {
    return true;
  }
  console.log(signature, inputSignature);
  console.warn('[payfast]: signatures do not match');
  return false;
}
