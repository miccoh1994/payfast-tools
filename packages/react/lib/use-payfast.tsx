import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode, 
  useMemo,
} from 'react';
import { generateSignature } from '@miccoh/payfast-core';
import type { CustomerDetails, MerchantDetails, TransactionDetails, TransactionOptions } from '@miccoh/payfast-core';

  export interface ReactPayfastProps {
    sandbox?: boolean;
    merchant: MerchantDetails;
    customer: CustomerDetails;
    transaction: TransactionDetails;
    options?: TransactionOptions;
    children?: ReactNode;
  }
  
  type FieldValue = string | number | readonly string[] | undefined;
  export function usePayfast({
    merchant,
    customer,
    transaction,
    options,
  }: ReactPayfastProps) {
    const mergedOpts = {
      ...merchant,
      ...customer,
      ...transaction,
      ...options,
    };

    const signature = useMemo(() => {
      return generateSignature({
        ...merchant,
        ...customer,
        ...transaction,
        ...options,
      });
    },  [customer, merchant, options, transaction])


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
  