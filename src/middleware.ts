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
  return next();
});