// middleware.ts (adaptado a tu app)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 🔐 Verificar si es una ruta protegida
    const isProtectedRoute = 
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api/reservations');

    if (!isProtectedRoute) {
      return NextResponse.next();
    }

    // 👤 Verificar autenticación básica
    if (!token) {
      return NextResponse.redirect(new URL('/pages/adminlogin', req.url));
    }

    // 🛡️ Verificaciones específicas por ruta
    if (pathname.startsWith('/admin')) {
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // ✅ Si pasa todas las verificaciones
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Esta verificación básica se ejecuta PRIMERO
        // Si retorna false, ni siquiera entra a la función de arriba
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|pages/adminlogin|unauthorized).*)"
  ]
};