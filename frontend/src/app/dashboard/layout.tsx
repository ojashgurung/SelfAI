"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const { logout, checkAuth, isLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    if (isLoading) return;

    const verifySession = async () => {
      try {
        if (!isMounted) return;

        const isValid = await checkAuth();

        if (!isValid && isMounted) {
          await logout();
          router.replace("/auth/signin");
          return;
        }

        if (isMounted) {
          setIsVerifying(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Session verification failed:", error);
          router.replace("/auth/signin");
        }
      }
    };

    verifySession();

    const interval = setInterval(verifySession, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkAuth, logout, router]);

  if (isVerifying) {
    return <div>Loading...</div>;
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
