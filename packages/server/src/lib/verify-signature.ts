import type { ISignatureInput } from '@miccoh/payfast-core';
import { generateSignature } from '@miccoh/payfast-core';

export function verifySignature(
  inputSignature: string | undefined,
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
