import jwt, { SignOptions } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'cambia_este_secreto';
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];

export interface JwtPayload {
  id: number;
  email: string;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: jwtExpiresIn };
  return jwt.sign(payload, jwtSecret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, jwtSecret) as JwtPayload;
}
