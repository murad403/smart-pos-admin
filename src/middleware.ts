import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const nextIntlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Split the pathname to look at the segments
  const pathSegments = pathname.split('/').filter(Boolean);

  let locale = routing.defaultLocale;
  let relativePath = pathname;

  if (pathSegments.length > 0 && routing.locales.includes(pathSegments[0] as any)) {
    locale = pathSegments[0] as typeof routing.defaultLocale;
    relativePath = '/' + pathSegments.slice(1).join('/');
  }

  const protectedRoutes = [
    '/dashboard',
    '/inventory-report',
    '/menu',
    '/item',
    '/payment-verification',
    '/profile',
    '/reports',
  ];

  const isProtected = protectedRoutes.some(route =>
    relativePath === route || relativePath.startsWith(route + '/')
  );

  if (isProtected) {
    const hasUserData = request.cookies.has('user_data');
    if (!hasUserData) {
      // Redirect to the sign-in page with the correct locale
      const signInUrl = new URL(`/${locale}/auth/sign-in`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(id|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
