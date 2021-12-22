import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { ReactPayfastProps } from '../types';
import { generateSignature } from '../util/hash';
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
    const sig = generateSignature({
      ...merchant,
      ...customer,
      ...transaction,
      ...options,
    });
    setSignature(sig);
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
    fields: [
      ...fields,
      {
        type: 'hidden',
        name: 'signature',
        value: signature,
      },
    ],
  };
}
