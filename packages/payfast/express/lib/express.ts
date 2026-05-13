import { PayfastValidator, type PayfastValidatorOptions } from '@knix/payfast-validation';
import express from 'express';
import type { Listener } from '@ngrok/ngrok';
import type { PayfastCreatePaymentRequest } from '@knix/payfast';

export type PayfastExpressAppOptions = PayfastValidatorOptions & {
    /**
     * IPN handler URL. If not provided and in development mode, the app will attempt to create a public URL using NGrok and use that URL for IPN handling. 
     * If not provided and not in development mode, the IPN handler will be available at `/payments/payfast/ipn` or `${prefix}/ipn` if a prefix is provided.
     * If provided, e.g. `https://myapp.com/api` then the IPN handler will be set to `https://myapp.com/api${prefix}/ipn}` (prefix provided) or `https://myapp.com/api/payments/payfast/ipn` if no prefix is provided.
     */
    ipnUrl?: string;
    /**
     * Optional prefix for the routes. Defaults to `/payments/payfast` e.g. `/payments/payfast/ipn` and `/payments/payfast/inputs`. If you set the prefix to `/payfast`, the routes will be `/payfast/ipn` and `/payfast/signature`.
     */
    prefix?: `/${string}`;
    /**
     * Optional passphrase for signature generation. If not provided, the `PAYFAST_PASSPHRASE` environment variable will be used. This is required for the `/inputs` route to work.
     */
    passphrase?: string;
}


function loadNgrok() {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }
    try {
        const loadAndForward = async () => {
            const { forward } = await import('@ngrok/ngrok');
            return await forward({ addr: 3333, authtoken: process.env.NGROK_AUTHTOKEN, host_header: 'rewrite' });
        }
        return loadAndForward();
    } catch (error) {
        console.error('Ngrok module is not installed. Please install @ngrok/ngrok to use NGrok features in development mode.', error);
        throw new Error('Ngrok module is not installed. Please install @ngrok/ngrok to use NGrok features in development mode.');
    }
}

export default function PayfastExpressApp(options: PayfastExpressAppOptions): express.Express {
    const app = express();
    console.log('Validation options:', options);
    const validator = new PayfastValidator(options);
    let ngrokUrl: string | null = null;
    let ngrokListenPromise: Promise<Listener> | null = loadNgrok();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    const prefix = (url: `/${string}`) => options.prefix ? `${options.prefix}${url}` : `/payments/payfast${url}`;

    app.post(prefix('/ipn'), async (req, res) => {
        const xForwardedForHeader = req.headers['x-forwarded-for']?.[0] || req.socket.remoteAddress;
        if (!xForwardedForHeader) {
            res.status(400).send({ message: 'No IP address found' });
            return;
        }
        const [valid, errorMessage] = await validator.validate({
            xForwardedForHeader,
            payload: req.body
        });

        if (valid) {
            res.status(200).send('success');
            return;
        }
        res.status(400).send({ message: errorMessage });
    });

    console.log('IPN handler will be available at:', options.ipnUrl ? `${options.ipnUrl}${prefix('/ipn')}` : `http://localhost:${process.env.PORT || 3333}${prefix('/ipn')}`);
    console.log('Inputs handler will be available at:', options.ipnUrl ? `${options.ipnUrl}${prefix('/inputs')}` : `http://localhost:${process.env.PORT || 3333}${prefix('/inputs')}`);

    app.post(prefix('/inputs'), async (req, res) => {
        const body = req.body as PayfastCreatePaymentRequest;
        let notify_url: string | null = options.ipnUrl ? `${options.ipnUrl}${prefix('/ipn')}` : null;
        if (process.env.NODE_ENV === 'development') {
            if (ngrokListenPromise) {
                try {
                    const listener = await ngrokListenPromise;
                    ngrokUrl = listener.url();
                    notify_url = `${ngrokUrl}${prefix('/ipn')}`;
                } catch (error) {
                    console.error('Failed to start NGrok tunnel:', error);
                    notify_url = null;
                }
            }

        }

        if (!notify_url) {
            throw new Error('IPN URL is not set and NGrok tunnel is not available. Cannot provide IPN handler URL.');
        }

        const m_payment_id = `payment_${Date.now()}`;
        const inputs = await validator.generateCreatePayementResponse(body, { notify_url, m_payment_id });

        res.send({ inputs });
    });

    return app;
}
