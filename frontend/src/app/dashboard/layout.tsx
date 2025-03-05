"use client";

import { Sidebar } from "@/components/dashboard/new_sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TokenService } from "@/lib/utils/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!TokenService.getAccessToken()) {
      router.replace("/signin");
      return;
    }

    const preventAuthNavigation = () => {
      router.replace("/dashboard");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventAuthNavigation);

    return () => {
      window.removeEventListener("popstate", preventAuthNavigation);
    };
  }, [router]);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 max-h-full overflow-y-auto m-4 bg-white rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}
