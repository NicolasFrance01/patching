import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow login page, auth API, upload API, and static assets
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/calendar") ||
    pathname.startsWith("/api/orders") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? "patching-secret-key-2024",
  });

  if (!token) {
    if (pathname.startsWith("/forgot-password")) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const mustChange = (token as any).mustChangePassword;
  
  if (mustChange && !pathname.startsWith("/api") && pathname !== "/change-password") {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }
  
  if (!mustChange && pathname === "/change-password") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = (token as any).role;

  // "Dashboard" role logic: can only access "/" and some basic utility routes
  if (role === "Dashboard") {
    const allowedPaths = ["/", "/change-password"];
    if (!allowedPaths.includes(pathname) && !pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // "Base" role logic: can only access basic modules
  if (role === "Base") {
    const allowedPaths = ["/", "/historial", "/reportes", "/calendario", "/change-password"];
    // if it's not one of those, redirect to /
    if (!allowedPaths.includes(pathname) && !pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Admin and other generic 'user' role are unrestricted for now (aside from /usuarios which should be admin only ideally)
  if (role !== "admin" && pathname.startsWith("/usuarios")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
