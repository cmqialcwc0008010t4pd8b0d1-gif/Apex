import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import DashboardBottomNav from "@/components/dashboard/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1120]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <DashboardSidebar user={user} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={user} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <DashboardBottomNav />
      </div>
    </div>
  );
}
