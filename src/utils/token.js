import crypto from 'crypto';

export function generateToken(length = 48) {
  return crypto.randomBytes(length).toString('hex');
}

export function ttlHoursToDate(hours) {
  const ms = Number(hours) * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}