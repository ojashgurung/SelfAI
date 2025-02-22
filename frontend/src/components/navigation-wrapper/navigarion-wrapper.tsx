"use client";

import { usePathname } from "next/navigation";
import { Header1 } from "@/components/ui/header";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Header1 />}
      {children}
    </>
  );
}
