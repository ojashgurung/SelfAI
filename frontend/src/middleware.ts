import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const isAuthPage =
    request.nextUrl.pathname === "/signin" ||
    request.nextUrl.pathname === "/signup";

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  }

  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
