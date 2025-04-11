"use client";

import SignInVisual from "@/components/auth/signin-visual";
import SignUpVisual from "@/components/auth/signup-visual";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <div className="p-10">
          <Link href="/">
            <div className="flex items-center text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 100 120"
              >
                <g transform="translate(10, 10) scale(0.08)">
                  <path
                    fill="currentColor"
                    d="M455 891c-206-95-215-418-16-536 39-23 51-36 51-55 1-48 11-70 35-70 12 0 28 7 35 14 6 8 33 29 59 45 40 26 58 31 108 31 78 0 142 23 195 69 124 109 132 323 17 441-69 71-100 80-284 80-135 0-166-3-200-19zm344-51c192-55 217-349 37-431-27-12-65-19-111-19-63 0-75-3-122-35l-52-35-3 28c-2 21-13 32-48 48-64 30-116 91-136 159-33 116 27 243 132 280 46 17 252 20 303 5z"
                  />
                  <path
                    fill="currentColor"
                    d="M630 720c-11-22-38-51-60-65-22-14-40-30-40-35s18-21 40-35c22-14 49-43 60-65 11-22 25-40 30-40s19 18 30 40c11 22 38 51 60 65 22 14 40 30 40 35s-18 21-40 35c-22 14-49 43-60 65-11 22-25 40-30 40s-19-18-30-40z"
                  />
                </g>
              </svg>
              <h1 className="text-xl font-semibold">selfAI.</h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </div>

      <div className="flex-1 bg-indigo-600 p-12 relative hidden lg:block">
        {pathname.includes("signup") ? <SignUpVisual /> : <SignInVisual />}
      </div>
    </div>
  );
}
