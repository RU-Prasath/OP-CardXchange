import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface JWTPayload {
  email: string;
  isSuperAdmin: boolean;
  permissions: {
    visibleScreens: string[];
    editableSections: string[];
  };
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getSession(request?: NextRequest): JWTPayload | null {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get('portfolio_session')?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get('portfolio_session')?.value;
    } catch {
      return null;
    }
  }

  if (!token) return null;
  return verifyJWT(token);
}
