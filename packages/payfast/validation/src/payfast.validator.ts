import type { PayfastITN, PayfastCreatePaymentResponse, PayfastCreatePaymentRequest } from "@knix/payfast";
import { md5 } from "#md5";
import { lookup } from "node:dns";

const VALID_ORIGINS = [
    'www.payfast.co.za',
    'ips.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za',
    'sandbox.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za',
];


export interface PayfastValidatorOptions {
    logger?: {
        info: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        error: (...args: any[]) => void;
    },
    sandbox?: boolean;
    passphrase?: string;
    merchant_id: string;
    merchant_key: string;
}

export class PayfastValidator {
    logger: NonNullable<PayfastValidatorOptions['logger']>;
    payfastHost: string;
    passphrase?: string;
    merchant_id: string;
    merchant_key: string;

    activePayments: Map<string, PayfastCreatePaymentRequest> = new Map();

    constructor(options: PayfastValidatorOptions) {
        this.logger = options?.logger || {
            info: () => { },
            warn: () => { },
            error: () => { },
        };
        this.payfastHost = options?.sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
        this.passphrase = options.passphrase;
        this.merchant_id = options.merchant_id;
        this.merchant_key = options.merchant_key;

    }


    async validate({
        xForwardedForHeader,
        payload,
    }: {
        xForwardedForHeader: string;
        payload: PayfastITN;
    }): Promise<[true, null] | [false, string]> {

        if (payload.payment_status !== 'COMPLETE') {
            this.logger.warn(`[payfast-validator] payment status is not COMPLETE: ${payload.payment_status}`);
            return [false, "Payment status is not COMPLETE"];
        }
        console.log('Starting validation for payload:', payload);

        const signatureValid = await this.verifySignature(payload);
        if (!signatureValid)
            return [false, "Invalid signature"];


        const originValid = await this.verifyOrigin(xForwardedForHeader);
        if (!originValid)
            return [false, "Invalid origin"];

        const amountValid = this.verifyAmount(payload.amount_gross, payload.amount_gross);
        if (!amountValid) return [false, "Invalid amount"];

        const serverConfirmed = await this.confirmWithServer(payload);
        if (!serverConfirmed) return [false, "Server confirmation failed"];
        this.activePayments.delete(payload.m_payment_id as string);
        return [true, null];
    }

    private inputFieldOrder = [
        'merchant_id',
        'merchant_key',
        'return_url',
        'cancel_url',
        'notify_url',
        'name_first',
        'name_last',
        'email_address',
        'm_payment_id',
        'amount',
        'item_name',
        'amount_fee',
        'amount_net',
        'custom_str1',
        'custom_str2',
        'custom_str3',
        'custom_str4',
        'custom_str5',
        'custom_int1',
        'custom_int2',
        'custom_int3',
        'custom_int4',
        'custom_int5',
        'email_confirmation',
        'confirmation_address',
        'passphrase',
        'signature',
    ] as Array<keyof (PayfastITN | PayfastCreatePaymentResponse)>;

    sortInputs<T extends PayfastITN | PayfastCreatePaymentResponse>(data: T): T {
        const orderedData = {} as T;
        for (const field of this.inputFieldOrder) {
            if (data[field] !== undefined && data[field] !== null) {
                (orderedData[field] as unknown) = data[field];
            } else if (!['passphrase', 'signature'].includes(field)) {
                (orderedData[field] as unknown) = ''; // PayFast requires all fields except passphrase and signature to be present, even if empty
            }
        }
        console.log('Sorted data according to PayFast requirements:', orderedData);
        return orderedData as T;
    }

    generateSignature(data: PayfastITN | PayfastCreatePaymentResponse, includeEmpty = false): Promise<string> {
        return md5(this.encodeParameters(data, includeEmpty));
    }

    async generateCreatePayementResponse(createRequest: PayfastCreatePaymentRequest, { notify_url, m_payment_id }: { notify_url: string, m_payment_id: string }): Promise<PayfastCreatePaymentResponse> {
        const raw = {
            ...createRequest,
            notify_url,
            m_payment_id,
            merchant_id: this.merchant_id,
            merchant_key: this.merchant_key,
            passphrase: this.passphrase,
            signature: '',
        }
        console.log('1. Generating payment response with raw data:', raw);
        const signature = await this.generateSignature(raw);
        const { passphrase: _, ...responseData } = raw;
        const response: PayfastCreatePaymentResponse = {
            ...responseData,
            signature,
        };
        console.log('4. Generated payment response:', response);
        this.activePayments.set(m_payment_id, createRequest);
        return this.sortInputs(response);
    }

    private encodeParameters(params: PayfastITN | PayfastCreatePaymentResponse, includeEmpty = false): string {
        const sortedParams = this.sortInputs(params);
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(sortedParams)) {
            if (key === 'signature') {
                continue;
            }
            if (value === undefined) {
                continue;
            }
            if (value === null) {
                continue;
            }
            if (!includeEmpty && value === '') {
                continue;
            }
            searchParams.set(key, String(value).trim());
        }
        return searchParams.toString();
    }



    private async verifySignature(data: PayfastITN): Promise<boolean> {
        const activePayment = this.activePayments.get(data.m_payment_id as string);
        if (activePayment) {
            this.logger.info(`[payfast-validator] found active payment for m_payment_id ${data.m_payment_id}. Using it to verify signature.`);
        }
        const dataToSign = { ...data, passphrase: this.passphrase, merchant_key: this.merchant_key, return_url: activePayment?.return_url, cancel_url: activePayment?.cancel_url};
        console.log('[IPN]. Verifying signature. Data to sign:', dataToSign);
        const signature = await this.generateSignature(dataToSign, true);
        console.log(`[payfast-validator] params used for signature generation:`, this.encodeParameters(dataToSign, true));
        this.logger.info(`[payfast-validator] computed signature: ${signature}`, `Received signature: ${data.signature}`);
        if (signature === data.signature) {
            console.log('[IPN]. Signature is valid.');
            this.logger.info(`[payfast-validator] signature is valid`);
            return true;
        }
        this.logger.warn(`[payfast-validator] signature is invalid. Computed: ${signature}, Received: ${data.signature}`);
        return false;
    }

    private async verifyOrigin(xForwardedFor: string): Promise<boolean> {
        if (process.env.NODE_ENV === 'development') {
            xForwardedFor = (xForwardedFor as string).split(',')[0];
        }
        try {
            const validIps = await Promise.all(
                VALID_ORIGINS.map((origin) => {
                    return this.dnsLookup(origin);
                })
            );
            if (validIps.flat().includes(xForwardedFor as string)) {
                return true;
            }
            this.logger.warn(`[payfast-validator] origin IP ${xForwardedFor} is not in the list of valid IPs: ${validIps.flat().join(', ')}`);
            return false;
        } catch (e) {
            this.logger.error(`[payfast-validator] error verifying origin: ${e}`);
            return false;
        }
    }

    private dnsLookup(origin: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            lookup(origin, { all: true }, (err, address) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(address.map((add) => add.address));
            });
        });
    }

    private verifyAmount(ipnAmount: number | string, payfastAmountGross: number | string
    ): boolean {
        const validAmount = Math.abs(Number(ipnAmount) - Number(payfastAmountGross)) < 0.01;
        if (validAmount) {
            this.logger.info(`[payfast-validator] amount is valid: IPN amount: ${ipnAmount}, Payfast gross amount: ${payfastAmountGross}`);
            return true;
        }
        this.logger.warn(`[payfast-validator] amount is invalid: IPN amount: ${ipnAmount}, Payfast gross amount: ${payfastAmountGross}`);
        return false;
    }

    private async confirmWithServer(data: PayfastITN | PayfastCreatePaymentResponse): Promise<boolean> {
        const url = `https://${this.payfastHost}/eng/query/validate`;
        const params = this.encodeParameters(data);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });
            if (!response.ok) {
                this.logger.warn(`[payfast-validator] failed to validate with server, host: ${this.payfastHost} \n error: ${response.statusText}`);
                return false;
            }
            const result = await response.text();
            if (result === 'VALID') {
                this.logger.info(`[payfast-validator] server confirmed validity for host: ${this.payfastHost}`);
                return true;
            }
            this.logger.warn(`[payfast-validator] server did not confirm validity for host: ${this.payfastHost} \n response: ${result}`);
            return false;
        } catch (e) {
            this.logger.error(`[payfast-validator] error confirming with server: ${e}`);
            return false;
        }
    }
}