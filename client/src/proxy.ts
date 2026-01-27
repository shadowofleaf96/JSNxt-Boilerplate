import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const locales = ['en', 'fr', 'ar'];

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return supabaseResponse;

  request.nextUrl.pathname = `/en${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
