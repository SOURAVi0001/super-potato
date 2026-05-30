import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/sales':        ['SALES', 'ADMIN'],
  '/sanction':     ['SANCTION', 'ADMIN'],
  '/disbursement': ['DISBURSEMENT', 'ADMIN'],
  '/collection':   ['COLLECTION', 'ADMIN'],
  '/apply':        ['BORROWER'],
  '/my-loan':      ['BORROWER'],
};

// Edge-safe JWT payload decoder utilizing native base64 atob
function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function middleware(request: any) {
  const { pathname } = request.nextUrl;

  // Match the requested route prefix to protected definitions
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find(route => 
    pathname.startsWith(route)
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  // 1. Verify existence of secure refresh cookie
  const refreshTokenCookie = request.cookies.get('refreshToken');
  if (!refreshTokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Decode the user parameters
  const payload = decodeJwt(refreshTokenCookie.value);
  if (!payload || !payload.role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = payload.role;

  // 3. ADMIN passes all dashboard checking, but has no borrower portal access
  if (userRole === 'ADMIN') {
    if (pathname.startsWith('/apply') || pathname.startsWith('/my-loan')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // 4. Evaluate access list matching matching roles
  const allowedRoles = PROTECTED_ROUTES[matchedRoute];
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 5. Redirect borrowers trying to access executive layouts
  if (userRole === 'BORROWER') {
    if (
      pathname.startsWith('/sales') ||
      pathname.startsWith('/sanction') ||
      pathname.startsWith('/disbursement') ||
      pathname.startsWith('/collection')
    ) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sales/:path*',
    '/sanction/:path*',
    '/disbursement/:path*',
    '/collection/:path*',
    '/apply/:path*',
    '/my-loan/:path*',
  ],
};
