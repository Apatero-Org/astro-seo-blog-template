import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Check if this is an admin route (but not the login page)
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const sessionToken = context.cookies.get('admin-session');

    // If not authenticated, redirect to login
    if (sessionToken?.value !== 'authenticated') {
      return context.redirect('/admin/login');
    }
  }

  // Continue with the request
  const response = await next();

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Add Content Security Policy (relaxed for development, tighten in production)
  if (!url.hostname.includes('localhost')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com"
    );
  }

  return response;
});