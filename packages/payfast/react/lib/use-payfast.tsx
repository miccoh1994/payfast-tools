import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useMemo,
} from 'react';
import type { PayfastCreatePaymentResponse } from '@knix/payfast';

export interface ReactPayfastProps {
  sandbox?: boolean;
  payfast?: PayfastCreatePaymentResponse;
  children?: ReactNode;
}

type FieldValue = string | number | readonly string[] | undefined;

export function usePayfastFields({
  payfast,
}: ReactPayfastProps) {

  const fields: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >[] = Object.entries({
    ...payfast,
  }).map(([key, value]) => {
    return {
      type: 'hidden',
      name: key,
      value: value as FieldValue,
    };
  });

  return fields
}
