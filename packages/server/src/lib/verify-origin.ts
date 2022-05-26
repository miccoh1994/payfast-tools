import { lookup } from 'dns';
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
/**
 * 
 * @param xForwardedFor req.headers['x-forwarded-for'] || req.socket.remoteAddress;
 * @returns 
 */
export async function verifyOrigin(xForwardedFor: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    xForwardedFor = (xForwardedFor as string).split(',')[0];
  }
  try {
    const validIps = await Promise.all(
      VALID_ORIGINS.map((origin) => {
        return dnsLookup(origin);
      })
    );
    if (validIps.flat().includes(xForwardedFor as string)) {
      return true;
    }
    console.warn('[payfast]: failed to validate origin');
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
