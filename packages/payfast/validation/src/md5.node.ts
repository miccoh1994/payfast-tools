import { createHash } from 'crypto';

export async function md5(input: string): Promise<string> {
  const hash = createHash('md5');
  hash.update(input);
  return hash.digest('hex');
}