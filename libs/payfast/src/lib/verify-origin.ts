import { lookup } from 'dns';
import { Request } from 'express';
const VALID_ORIGINS = [
  'www.payfast.co.za',
  'sandbox.payfast.co.za',
  'w1w.payfast.co.za',
  'w2w.payfast.co.za',
];

export function dnsLookup(origin: string): Promise<string[]> {
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

export async function verifyOrigin(req: Request) {
  let payfastIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (process.env.NODE_ENV === 'development') {
    payfastIp = (payfastIp as string).split(',')[0];
  }
  try {
    const validIps = await Promise.all(
      VALID_ORIGINS.map((origin) => {
        return dnsLookup(origin);
      })
    );
    if (validIps.flat().includes(payfastIp as string)) {
      return true;
    }
    console.warn('[payfast]: failed to validate origin');
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
