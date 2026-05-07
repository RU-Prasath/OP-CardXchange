import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — always allow
  if (
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/landing') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/preview') ||
    pathname.startsWith('/portfolio') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // Super admin routes
  if (pathname.startsWith('/super-admin')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (session.role !== 'superadmin') return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  // User admin routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (session.role === 'superadmin') return NextResponse.redirect(new URL('/super-admin', request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/dashboard/:path*', '/login', '/templates', '/preview/:path*'],
};
