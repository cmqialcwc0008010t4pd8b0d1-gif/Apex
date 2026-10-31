import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { User, ShieldCheck, Phone, Calendar, Gift, Lock, CheckCircle2 } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Student Profile</h2>
        <p className="text-xs text-slate-400 mt-1">
          Your permanent student record, contact details, and institutional credentials.
        </p>
      </div>

      <div className="finance-card p-6 md:p-8 space-y-8">
        {/* Profile Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-800 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-teal-600/30">
            {user.fullName.charAt(0)}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  user.membershipStatus === "ACTIVE"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-amber-950 text-amber-400 border border-amber-800"
                }`}
              >
                {user.membershipStatus}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Role: <span className="font-semibold text-slate-200">{user.role}</span> &bull; Account Status: <span className="text-emerald-400 font-semibold">{user.accountStatus}</span>
            </div>
          </div>
        </div>

        {/* Read-only permanent credential fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Unique Student ID</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-lg font-bold font-mono text-teal-400">{user.uniqueUserId}</div>
            <p className="text-[10px] text-slate-400">Permanent identifier; cannot be altered.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Personal Referral Code</span>
              <Gift className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-lg font-bold font-mono text-white">{user.referralCode}</div>
            <p className="text-[10px] text-slate-400">Share with prospective students to build your team.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Normalized Mobile Number</span>
              <Phone className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-base font-semibold text-white">{user.mobileNumber}</div>
            <p className="text-[10px] text-slate-400">Used as primary authentication key.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Registration Date</span>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-base font-semibold text-white">{formatDate(user.createdAt)}</div>
            <p className="text-[10px] text-slate-400">Student enrollment record timestamp.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800 md:col-span-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Referred By (Sponsor)</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-sm font-semibold text-white">
              {user.referrer ? (
                <span>{user.referrer.fullName} ({user.referrer.uniqueUserId})</span>
              ) : (
                <span className="text-slate-400 italic">Direct Academy Registration (No Sponsor)</span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Sponsor linkage is immutable to preserve network integrity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
