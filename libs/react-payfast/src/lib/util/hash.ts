import { MD5 } from 'crypto-js';
import { ISignatureInput } from '../types';

export function generateSignature(
  data: ISignatureInput,
  passphrase?: string
): string {
  const parameterString = Object.entries(data)
    .reduce((prev, [key, value]) => {
      return (
        prev +
        `${key}=${encodeURIComponent(String(value).trim()).replace(
          /%20/g,
          '+'
        )}&`
      );
    }, '')
    .slice(0, -1);

  if (passphrase) {
    return MD5(parameterString + '&passphrase=' + passphrase).toString();
  }
  return MD5(parameterString).toString();
}
