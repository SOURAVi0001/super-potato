import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '@lms/shared/src/types/user.types';

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
