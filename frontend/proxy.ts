import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  // Check for the NextAuth session token (handles decryption automatically)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const isAuthenticated = !!token;

  // Debug logging
  console.log("🔐 Middleware Debug:", {
    path: req.nextUrl.pathname,
    isAuthenticated,
  });

  const publicPages = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  const isPublicPage = publicPages.includes(req.nextUrl.pathname);

  // 1. Not logged in + Protected Page -> Login
  if (!isAuthenticated && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Logged in + Public Page -> Home (or Dashboard)
  // Note: Usually you allow logged-in users to see home ('/'), 
  // so maybe only redirect if they are specifically on /login or /signup
  const isAuthPage = ["/login", "/signup"].includes(req.nextUrl.pathname);
  
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|models|api).*)"],
};