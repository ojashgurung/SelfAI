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
    if (isLoading) {
      console.log("Loading auth state...");
      return;
    }

    const verifySession = async () => {
      try {
        setIsVerifying(true);
        const isValid = await checkAuth();

        if (!isValid) {
          console.log("Invalid session, redirecting to signin");
          await logout();
          router.replace("/auth/signin");
        } else {
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        router.replace("/auth/signin");
      }
    };

    // Initial verification with delay
    const initialCheck = setTimeout(verifySession, 500);

    // Periodic verification
    const interval = setInterval(verifySession, 300000);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, [router, checkAuth, logout, isLoading]);

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
