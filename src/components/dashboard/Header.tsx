"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Bell, ShieldCheck, User } from "lucide-react";
import DashboardSidebar from "./Sidebar";

export default function DashboardHeader({ user }: { user: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-[#0B1120] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white tracking-tight">ApexEdge Student Portal</h1>
            <p className="text-[10px] text-slate-400">Institutional Financial & Trading Education</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Membership Status Badge */}
          <Link
            href="/dashboard/membership"
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              user?.membershipStatus === "ACTIVE"
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60"
                : "bg-amber-950/80 text-amber-400 border border-amber-800 hover:bg-amber-900/60 animate-pulse"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{user?.membershipStatus === "ACTIVE" ? "Active Member" : "Pending Activation"}</span>
          </Link>

          {/* Notifications Link */}
          <Link
            href="/dashboard/notifications"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </Link>

          {/* Profile Quick Pill */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-white transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-teal-700 flex items-center justify-center font-bold text-[10px] text-white">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <span className="hidden md:inline font-medium">{user?.fullName?.split(" ")[0]}</span>
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="relative w-72 max-w-[85vw] bg-[#0F172A] z-10 h-full flex flex-col shadow-2xl">
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <DashboardSidebar user={user} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
