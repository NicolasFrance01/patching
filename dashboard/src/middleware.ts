import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    
    if (token) {
      const mustChange = (token as any).mustChangePassword;
      // Exclude api routes and the change-password page itself
      if (mustChange && !pathname.startsWith("/api") && pathname !== "/change-password") {
        return NextResponse.redirect(new URL("/change-password", req.url));
      }
      if (!mustChange && pathname === "/change-password") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - forgot-password (forgot password page)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|forgot-password).*)",
  ],
};
