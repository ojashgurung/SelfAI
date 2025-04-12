"use client";

import SignInVisual from "@/components/auth/signin-visual";
import SignUpVisual from "@/components/auth/signup-visual";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo/Logo";

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
          <Logo />
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </div>

      <div className="flex-1 bg-indigo-600 p-12 relative hidden lg:block">
        {pathname.includes("signup") ? <SignUpVisual /> : <SignInVisual />}
      </div>
    </div>
  );
}
