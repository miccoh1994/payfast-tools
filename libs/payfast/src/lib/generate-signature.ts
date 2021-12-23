import { MD5 } from 'crypto-js';
import {
  CustomerDetails,
  MerchantDetails,
  TransactionDetails,
  TransactionOptions,
} from '@za-payments/react-payfast';

export type ISignatureInput = MerchantDetails &
  CustomerDetails &
  TransactionDetails &
  TransactionOptions;

export function generateSignature(
  data: ISignatureInput,
  passphrase?: string
): string {
  const parameterString = getParameterString(data, passphrase);
  return MD5(parameterString).toString();
}
export function getParameterString(data: ISignatureInput, passphrase?: string) {
  const parameterString = Object.entries(data)
    .reduce((prev, [key, value]) => {
      if (key === 'signature') {
        return prev;
      }
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
    return parameterString + '&passphrase=' + passphrase;
  }
  return parameterString;
}

export function getParameterStringWithSignature(
  data: ISignatureInput,
  passphrase?: string
) {
  const paramString = getParameterString(data, passphrase);
  const signature = generateSignature(data, passphrase);
  return paramString + '&signature=' + signature;
}
