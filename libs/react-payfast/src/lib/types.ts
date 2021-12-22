export interface MerchantDetails {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  passphrase?: string;
}

export interface CustomerDetails {
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number?: string;
}

export interface TransactionDetails {
  m_payment_id: string;
  amount: number;
  item_name: string;
  item_description: string;
  custom_int1?: number;
  custom_int2?: number;
  custom_int3?: number;
  custom_int4?: number;
  custom_int5?: number;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
}

export type BaseOptions = {
  subscriptionType?: number;
  email_confirmation?: boolean;
  confirmation_address?: boolean;
  payment_method?:
    | 'eft'
    | 'cc'
    | 'dc'
    | 'mp'
    | 'mc'
    | 'sc'
    | 'ss'
    | 'zp'
    | 'mt';
};
export interface SubscriptionOptions extends BaseOptions {
  subscription_type: 1;
  frequency: number;
  cycles: number;
}

export type TransactionOptions = BaseOptions | SubscriptionOptions;
export interface ReactPayfastProps {
  sandbox?: boolean;
  merchant: MerchantDetails;
  customer: CustomerDetails;
  transaction: TransactionDetails;
  options?: TransactionOptions;
}

export type ISignatureInput = MerchantDetails &
  CustomerDetails &
  TransactionDetails &
  TransactionOptions;
