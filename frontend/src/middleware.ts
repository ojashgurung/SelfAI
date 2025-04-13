import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthPage =
    request.nextUrl.pathname === "/auth/signin" ||
    request.nextUrl.pathname === "/auth/signup";

  console.log({
    path: request.nextUrl.pathname,
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    isAuthPage,
  });

  if (isAuthPage && token && refreshToken) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    // Prevent caching issues
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token || !refreshToken) {
      const response = NextResponse.redirect(
        new URL("/auth/signin", request.url)
      );
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      return response;
    }
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/signin", "/auth/signup", "/"],
};
