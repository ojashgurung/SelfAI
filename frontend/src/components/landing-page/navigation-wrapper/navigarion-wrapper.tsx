"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/landing-page/header/header";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname?.startsWith("/auth");
  const isPublicChat = pathname?.startsWith("/chat");

  return (
    <>
      {!isDashboard && !isPublicChat && !isAuth && <Header />}
      {children}
    </>
  );
}
