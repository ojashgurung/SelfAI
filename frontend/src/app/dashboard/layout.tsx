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
  const { logout, checkAuth, isLoading, authReady } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!authReady) {
      console.log("Auth not ready, waiting...");
      return;
    }

    const verifySession = async () => {
      try {
        setIsVerifying(true);
        console.log("Verifying session");
        const isValid = await checkAuth();
        console.log("Session valid:", isValid);

        if (!isValid) {
          console.log("Session invalid, redirecting to signin");
          await logout();
          router.replace("/auth/signin");
        } else {
          console.log("Session valid, staying on dashboard");
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Session verification error:", error);
        router.replace("/auth/signin");
      }
    };

    // Initial check with delay
    const initialCheck = setTimeout(verifySession, 100);

    // Periodic check
    const interval = setInterval(verifySession, 300000);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, [router, checkAuth, logout, authReady]);

  if (isVerifying) {
    return <div>Verifying session...</div>;
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
