/**
 * Generates an MD5 hash for the given input string using the Web Crypto API.
 * Note: This function is designed to work in environments that support the Web Crypto API, such as cloudflare workers and bun.
 * For Node.js environments, a separate implementation using the 'crypto' module is provided in md5.node.ts.
 * Trying to use this in the browser will intentionally fail as this module should not be used in browser environments.
 * @param string
 * @returns string
 */

if (typeof crypto === 'undefined' || !crypto.subtle || typeof crypto.subtle.digest !== 'function') {
  throw new Error('Web Crypto API is not available in this environment. This module is intended for use in environments that support the Web Crypto API, such as Cloudflare Workers and Bun. For Node.js environments, please use the md5.node.ts implementation.');
}

// @ts-expect-error -- This is a valid check for browser environments, but TypeScript doesn't recognize it as such.
if (typeof window !== 'undefined') {
  throw new Error('This module is not intended for use in browser environments. It is designed for server-side environments that support the Web Crypto API, such as Cloudflare Workers and Bun.');
}
export async function md5(input: string): Promise<string> {

  
  
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}