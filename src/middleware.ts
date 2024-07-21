import { clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher(['/site', '/agency/sign-in','/api/uploadthing']);

export default clerkMiddleware((auth:ClerkMiddlewareAuth, req:NextRequest) => {
  const { userId } = auth();
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString()
  console.log(url);
  
  let hostname = req.headers;
  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`
  if (
    url.pathname === '/' ||
    (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL('/site', req.url))
  }
  
  if (!isPublicRoute(req) && !userId) {
    // if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    //   return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
    // }
    const signInUrl:URL = new URL('/agency/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
