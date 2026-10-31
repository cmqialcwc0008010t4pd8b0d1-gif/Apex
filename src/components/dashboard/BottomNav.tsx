"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Calendar, Wallet, User } from "lucide-react";

export default function DashboardBottomNav() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Daily", href: "/dashboard/daily-learning", icon: Calendar },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? "text-teal-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
