import { Sidebar } from "@/components/dashboard/new_sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 max-h-full overflow-y-auto m-4 bg-white rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}
