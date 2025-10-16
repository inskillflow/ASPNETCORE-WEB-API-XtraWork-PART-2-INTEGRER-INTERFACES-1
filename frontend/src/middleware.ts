import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Next.js pour protéger les routes
 * Ce middleware s'exécute AVANT le rendu des pages
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques (pas de vérification)
  const publicPaths = ['/', '/auth/login', '/auth/register'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Routes protégées (nécessitent authentification)
  if (pathname.startsWith('/dashboard')) {
    // Vérifier si le token existe dans les cookies ou headers
    const token = request.cookies.get('token')?.value;
    
    // Si pas de token, rediriger vers login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/**
 * Configuration du middleware
 * Définit sur quelles routes le middleware s'applique
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

