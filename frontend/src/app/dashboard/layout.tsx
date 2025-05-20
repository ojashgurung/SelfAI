"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/Sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const { logout, checkAuth, isLoading } = useAuth();

  useEffect(() => {
    const verify = async () => {
      const isValid = await checkAuth();
      if (!isValid) {
        await logout();
        router.replace("/auth/signin");
      } else {
        setVerified(true);
      }
    };

    verify();

    const interval = setInterval(verify, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAuth, logout, router]);

  if (!verified && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading dashboard...
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 max-h-full overflow-y-auto m-4 bg-white rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}
