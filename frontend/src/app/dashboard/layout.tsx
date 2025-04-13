"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, checkAuth, isLoading, authReady } = useAuth();

  useEffect(() => {
    if (!authReady) return;

    const verifySession = async () => {
      const isValid = await checkAuth();
      if (!isValid) {
        logout();
        router.replace("/auth/signin");
      }
    };
    verifySession();
    const interval = setInterval(verifySession, 300000);

    return () => {
      clearInterval(interval);
    };
  }, [router, checkAuth, logout, isLoading, authReady]);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 max-h-full overflow-y-auto m-4 bg-white rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}
