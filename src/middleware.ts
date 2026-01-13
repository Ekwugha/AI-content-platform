import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Rate limiting headers (for monitoring)
  const ip = request.ip ?? "127.0.0.1";
  response.headers.set("X-Real-IP", ip);

  // Protected routes check
  const pathname = request.nextUrl.pathname;
  
  // For protected routes, we would check for authentication here
  // In production, integrate with NextAuth.js or similar
  const protectedPaths = ["/dashboard", "/api/content", "/api/calendar", "/api/team"];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // API routes require authentication (except AI routes which have their own limits)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/ai/")) {
    // Check for API key or session token
    const authHeader = request.headers.get("authorization");
    const sessionToken = request.cookies.get("session-token");

    // In production, validate the token/key here
    // For now, we allow all requests (demo mode)
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};

