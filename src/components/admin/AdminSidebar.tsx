"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  Network,
  Award,
  Wallet,
  BarChart3,
  Bell,
  Globe,
  HelpCircle,
  ShieldAlert,
  Settings,
  Lock,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logoutUser } from "@/app/actions/auth";

const adminNav = [
  { name: "A. Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "B. User Management", href: "/admin/users", icon: Users },
  { name: "C. Course Management", href: "/admin/courses", icon: BookOpen },
  { name: "D. Daily Learning", href: "/admin/daily-learning", icon: Calendar },
  { name: "E. Payment Verification", href: "/admin/payments", icon: CreditCard },
  { name: "F. Referral Management", href: "/admin/referrals", icon: Network },
  { name: "G. Bonus Slabs", href: "/admin/bonus", icon: Award },
  { name: "H. Financial Ledger", href: "/admin/finance", icon: Wallet },
  { name: "I. Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  { name: "J. Notifications Desk", href: "/admin/notifications", icon: Bell },
  { name: "K. Website CMS", href: "/admin/cms", icon: Globe },
  { name: "L. Support Tickets", href: "/admin/support", icon: HelpCircle },
  { name: "M. Security & Roles", href: "/admin/security", icon: ShieldAlert },
  { name: "N. Platform Settings", href: "/admin/settings", icon: Settings },
  { name: "Investment Module", href: "/admin/investment", icon: Lock, badge: "DISABLED" },
];

export default function AdminSidebar({
  admin,
  onClose,
}: {
  admin: any;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#070D19] border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-md shadow-amber-600/30">
            <ShieldAlert className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1">
              SUPER<span className="text-amber-400">ADMIN</span>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">ApexEdge Console</div>
          </div>
        </Link>
      </div>

      {/* Admin Role Identity Chip */}
      <div className="p-3.5 mx-3 my-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-amber-400 font-bold">{admin?.uniqueUserId}</span>
          <span className="px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
            {admin?.role}
          </span>
        </div>
        <div className="text-xs font-semibold text-white truncate">{admin?.fullName}</div>
      </div>

      {/* 14 Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 text-xs">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Link back to Student Portal */}
        <div className="pt-3 mt-3 border-t border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-teal-400 hover:bg-teal-950/30 rounded-lg transition-colors"
          >
            <span>Student Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800">
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
