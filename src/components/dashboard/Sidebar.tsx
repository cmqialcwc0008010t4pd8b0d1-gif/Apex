"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  BookOpen,
  Calendar,
  History,
  Users,
  Network,
  TrendingUp,
  Award,
  Wallet,
  ArrowDownToLine,
  Receipt,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logoutUser } from "@/app/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "My Membership", href: "/dashboard/membership", icon: ShieldCheck },
  { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Daily Learning", href: "/dashboard/daily-learning", icon: Calendar },
  { name: "Learning History", href: "/dashboard/history", icon: History },
  { name: "My Referrals", href: "/dashboard/referrals", icon: Users },
  { name: "My Team", href: "/dashboard/team", icon: Network },
  { name: "Earnings", href: "/dashboard/earnings", icon: TrendingUp },
  { name: "Bonus", href: "/dashboard/bonus", icon: Award },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { name: "Withdrawals", href: "/dashboard/withdrawals", icon: ArrowDownToLine },
  { name: "Transaction History", href: "/dashboard/transactions", icon: Receipt },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Support Desk", href: "/dashboard/support", icon: HelpCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar({
  user,
  onClose,
}: {
  user: any;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-md shadow-teal-600/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-1">
              APEX<span className="text-teal-400">EDGE</span>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Student Portal</div>
          </div>
        </Link>
      </div>

      {/* User Badge Info */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-teal-400 font-bold tracking-wider">{user?.uniqueUserId}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
              user?.membershipStatus === "ACTIVE"
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-amber-950 text-amber-400 border border-amber-800"
            }`}
          >
            {user?.membershipStatus || "PENDING"}
          </span>
        </div>
        <div className="text-xs font-semibold text-white truncate">{user?.fullName}</div>
        <div className="text-[10px] text-slate-400 truncate">{user?.mobileNumber}</div>
      </div>

      {/* 16 Navigation items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-teal-600/15 text-teal-300 border-l-2 border-teal-400 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}

        {/* If user is Admin, show quick link to Admin panel */}
        {user?.role && ["SUPER_ADMIN", "FINANCE_ADMIN", "COURSE_MANAGER", "SUPPORT_ADMIN", "ANALYST"].includes(user.role) && (
          <div className="pt-3 mt-3 border-t border-slate-800">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-amber-400 hover:bg-amber-950/30 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Super Admin Panel</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800">
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
