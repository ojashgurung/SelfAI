"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/landing-page/header/header";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname?.startsWith("/app");
  const isAuth = pathname?.startsWith("/auth");
  const isPublicChat = pathname?.startsWith("/chat");

  return (
    <>
      {!isApp && !isPublicChat && !isAuth && <Header />}
      {children}
    </>
  );
}
