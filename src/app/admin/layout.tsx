import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const allowedRoles = ["SUPER_ADMIN", "FINANCE_ADMIN", "COURSE_MANAGER", "SUPPORT_ADMIN", "ANALYST"];
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#070D19]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar admin={user} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-[#070D19] border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800">
              Admin Console
            </span>
            <span className="text-xs text-slate-400 font-mono">Role: {user.role}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white font-semibold">{user.fullName}</span>
            <div className="w-7 h-7 rounded-full bg-amber-600 text-slate-950 flex items-center justify-center font-bold text-xs">
              {user.fullName.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
