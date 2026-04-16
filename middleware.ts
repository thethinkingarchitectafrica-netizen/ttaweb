import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request);

  // Check if we are in the admin area
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip protection for the login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return response;
    }

    const { data: { user } } = await supabase.auth.getUser();

    // If no user is logged in, redirect to login page
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this matcher to fit your needs.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
