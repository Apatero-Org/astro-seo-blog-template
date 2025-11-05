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

  // Add security headers to all responses (2025 best practices)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); // HSTS - 1 year
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Add Content Security Policy (relaxed for development, tighten in production)
  if (!url.hostname.includes('localhost')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; worker-src 'self' blob:; manifest-src 'self'"
    );
  }

  // Add sophisticated caching headers based on resource type
  const pathname = url.pathname;
  const contentType = response.headers.get('content-type') || '';

  // Static assets - aggressive caching (1 year)
  if (pathname.match(/\.(js|css|woff|woff2|ttf|eot|jpg|jpeg|png|webp|avif|gif|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // HTML pages - revalidate frequently (1 hour, must revalidate)
  else if (contentType.includes('text/html')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  // API/dynamic routes - no cache
  else if (pathname.startsWith('/api/') || pathname.startsWith('/admin/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  // Default - moderate caching (1 day)
  else {
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
  }

  // Add ETags for better caching
  if (!response.headers.has('ETag')) {
    // ETag will be added by the server/CDN
    response.headers.set('Vary', 'Accept-Encoding');
  }

  return response;
});