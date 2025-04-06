import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the pathname of the request
    const { pathname } = req.nextUrl;
    
    // Vérifier si l'utilisateur est connecté
    if (!req.nextauth.token) {
      // Si la route commence par /mon-compte ou /admin, rediriger vers la connexion
      if (pathname.startsWith('/mon-compte') || pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL(`/auth/connexion?callbackUrl=${pathname}`, req.url));
      }
    }
    
    // Vérifier si l'utilisateur est admin pour accéder au panel admin
    if (pathname.startsWith('/admin') && !req.nextauth.token?.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/connexion',
    },
  }
);

// Appliquer le middleware aux routes suivantes
export const config = {
  matcher: ['/mon-compte/:path*', '/admin/:path*'],
};