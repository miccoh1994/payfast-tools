import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { ReactPayfastProps } from '../types';
import { generateSignature } from '@za-payments/payfast/lib/generate-signature';
type FieldValue = string | number | readonly string[] | undefined;
export function usePayfast({
  merchant,
  customer,
  transaction,
  options,
}: ReactPayfastProps) {
  const [signature, setSignature] = useState('');
  const mergedOpts = {
    ...merchant,
    ...customer,
    ...transaction,
    ...options,
  };
  useEffect(() => {
    if (merchant.passphrase) {
      const sig = generateSignature({
        ...merchant,
        ...customer,
        ...transaction,
        ...options,
      });
      setSignature(sig);
    }
  }, []);
  const fields: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >[] = Object.entries(mergedOpts).map(([key, value]) => {
    return {
      type: 'hidden',
      name: key,
      value: value as FieldValue,
    };
  });
  return {
    signature,
    fields: [...fields],
  };
}
