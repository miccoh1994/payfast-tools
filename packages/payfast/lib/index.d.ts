export type PayfastITN = PayfastITNComplete | PayfastITNCancelled;

export type PayfastITNComplete = {
    m_payment_id?: string;
    pf_payment_id?: string;
    payment_status: 'COMPLETE';
    item_name: string;
    item_description?: string;
    amount_gross: number;
    amount_fee: number;
    amount_net: number;
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
    name_first: string;
    name_last: string;
    email_address: string;
    merchant_id: string;
    // TODO: implement subscription parameters https://developers.payfast.co.za/docs#step_4_confirm_payment
    // token: string; 
    // billing_date: Status extends 'COMPLETE' ? string : undefined;
    signature: string;
}

export type PayfastITNCancelled = {
    m_payment_id?: string;
    pf_payment_id?: string;
    payment_status: 'CANCELLED';
    item_name: string;
    item_description?: string;
    amount_gross?: number;
    amount_fee?: number;
    amount_net?: number;
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
    name_first: string;
    name_last: string;
    email_address: string;
    merchant_id: string;
    // TODO: implement subscription parameters https://developers.payfast.co.za/docs#step_4_confirm_payment
    // token: string; 
    // billing_date: Status extends 'COMPLETE' ? string : undefined;
    signature: string;
}

const PAYMENT_METHODS = [
    'ef',
    'cc',
    'dc',
    'mp',
    'mc',
    'sc',
    'ss',
    'zp',
    'mt',
    'rc',
    'mu',
    'ap',
    'sp',
    'cp',
    'ab',
    'gp',
    'nd',
    'pf'
] as const;

export type PayfastPaymentMethod = typeof PAYMENT_METHODS[number];

export type PayfastCreatePaymentRequest = {
    // merchant_id: string;
    // merchant_key: string;
    return_url: string;
    cancel_url: string;
    // notify_url: string;
    fica_idnumber?: string;
    name_first?: string;
    name_last?: string;
    email_address?: string;
    cell_number?: string;
    // m_payment_id: string;
    amount: number;
    item_name: string;
    item_description?: string;
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
    email_confirmation?: 0 | 1;
    confirmation_address?: string;
    payment_method?: PayfastPaymentMethod;
    // TODO: implement subscription parameters https://developers.payfast.co.za/docs#step_1_form_fields
}

export type PayfastCreatePaymentResponse = {
    merchant_id: string;
    merchant_key: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
} & Omit<PayfastCreatePaymentRequest, 'merchant_id' | 'merchant_key' | 'return_url' | 'cancel_url' | 'notify_url' | 'passphrase'> & {
    signature: string;
}