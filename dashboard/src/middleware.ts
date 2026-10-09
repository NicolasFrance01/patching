import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    // "Dashboard" role logic: can only access "/" and some basic utility routes
    if (role === "Dashboard") {
      const allowedPaths = ["/", "/change-password"];
      if (!allowedPaths.includes(path) && !path.startsWith("/api")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // "Base" role logic: can only access basic modules
    if (role === "Base") {
      const allowedPaths = ["/", "/historial", "/reportes", "/calendario", "/change-password"];
      // if it's not one of those, redirect to /
      if (!allowedPaths.includes(path) && !path.startsWith("/api")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Admin and other generic 'user' role are unrestricted for now (aside from /usuarios which should be admin only ideally)
    if (role !== "admin" && path.startsWith("/usuarios")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|forgot-password).*)",
  ],
};
