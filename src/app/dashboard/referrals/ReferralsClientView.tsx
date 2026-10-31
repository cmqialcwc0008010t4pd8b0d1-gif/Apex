"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Copy,
  Check,
  Gift,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function ReferralsClientView({
  user,
  directReferrals,
  commissionSettings,
}: {
  user: any;
  directReferrals: any[];
  commissionSettings: any[];
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const referralLink = `${appUrl}/register?ref=${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Direct Referrals Program</h2>
        <p className="text-xs text-slate-400 mt-1">
          Share your referral credentials to invite new students and track personal recruitment history.
        </p>
      </div>

      {/* Compliance Warning Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-teal-800/80 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-teal-400">
          <ShieldAlert className="w-4 h-4 text-teal-400" />
          <span>Anti-Pyramid Direct-Selling Compliance Notice:</span>
        </div>
        <p className="leading-relaxed">
          Referral tracking is maintained for educational community analytics. In compliance with direct-selling regulatory standards, multi-level commission payouts are held in disabled configuration mode. Payouts are never derived from recruitment fees or initial membership charges.
        </p>
      </div>

      {/* Referral Link & Code Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="finance-card p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Your Referral Link</span>
            <h3 className="text-base font-bold text-white">Direct Invitation URL</h3>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-teal-300 truncate select-all">{referralLink}</span>
            <button
              onClick={copyLink}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors"
              title="Copy Referral Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Automatically populates your referral code during student registration.
          </p>
        </div>

        <div className="finance-card p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Your Referral Code</span>
            <h3 className="text-base font-bold text-white">Manual Referral Key</h3>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
            <span className="font-mono text-base font-bold text-white tracking-widest">{user.referralCode}</span>
            <button
              onClick={copyCode}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors"
              title="Copy Code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Students can manually enter this code or your Unique ID (<strong>{user.uniqueUserId}</strong>).
          </p>
        </div>
      </div>

      {/* Direct Referrals History Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Direct Referrals (Level 1)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Students enrolled using your referral link.</p>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-teal-950 text-teal-400 border border-teal-800">
            {directReferrals.length} Students
          </span>
        </div>

        {directReferrals.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No direct referrals yet. Share your referral link to build your team.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Student ID</th>
                  <th className="py-3 px-3 font-semibold">Full Name</th>
                  <th className="py-3 px-3 font-semibold">Mobile Number</th>
                  <th className="py-3 px-3 font-semibold">Registration Date</th>
                  <th className="py-3 px-3 font-semibold">Membership Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {directReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono font-bold text-teal-400">{ref.uniqueUserId}</td>
                    <td className="py-3 px-3 font-semibold text-white">{ref.fullName}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{ref.mobileNumber.slice(0, 4)}***{ref.mobileNumber.slice(-3)}</td>
                    <td className="py-3 px-3 text-slate-400">{formatDate(ref.createdAt)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ref.membershipStatus === "ACTIVE"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {ref.membershipStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-right">
        <Link
          href="/dashboard/team"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
        >
          <span>View Complete 10-Level Team Visualizer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
