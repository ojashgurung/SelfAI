import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthPage =
    request.nextUrl.pathname === "/auth/signin" ||
    request.nextUrl.pathname === "/auth/signup";

  if (isAuthPage && accessToken && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/signin", "/auth/signup", "/"],
};
