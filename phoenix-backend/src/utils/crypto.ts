import crypto from 'crypto';

export function encodeWithHash(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}
