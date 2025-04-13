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
  const { logout, checkAuth, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Wait for checkAuth to finish

    const verifySession = async () => {
      const isValid = await checkAuth();
      if (!isValid) {
        await logout();
        router.replace("/auth/signin");
      }
    };
    verifySession();
    const interval = setInterval(verifySession, 300000);

    return () => {
      clearInterval(interval);
    };
  }, [router, checkAuth, logout, isLoading]);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 max-h-full overflow-y-auto m-4 bg-white rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}
