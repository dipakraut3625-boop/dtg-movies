import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isLogin = pathname === "/login";

  // 🔍 Check auth cookie manually
  const token = req.cookies.get("sb-access-token");

  // ❌ NOT LOGGED IN → redirect to login
  if (!token && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ LOGGED IN → block login page
  if (token && isLogin) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/watchlist",
    "/liked",
    "/movie/:path*",
  ],
};