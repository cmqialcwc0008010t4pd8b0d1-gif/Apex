"use client";

import { useState } from "react";
import { updateCommissionSetting } from "@/app/actions/referral-admin";
import { formatDate } from "@/lib/utils";
import { Network, ShieldAlert, Save, Check } from "lucide-react";

export default function AdminReferralsClient({
  commissionSettings,
  referralRelations,
}: {
  commissionSettings: any[];
  referralRelations: any[];
}) {
  const [tiers, setTiers] = useState(commissionSettings);
  const [savingLevel, setSavingLevel] = useState<number | null>(null);
  const [successLevel, setSuccessLevel] = useState<number | null>(null);

  const handlePercentageChange = (level: number, val: string) => {
    const num = parseFloat(val) || 0;
    setTiers((prev) =>
      prev.map((t) => (t.level === level ? { ...t, percentage: num } : t))
    );
  };

  const handleToggleActive = (level: number, current: boolean) => {
    setTiers((prev) =>
      prev.map((t) => (t.level === level ? { ...t, isActive: !current } : t))
    );
  };

  const saveTier = async (level: number) => {
    const tier = tiers.find((t) => t.level === level);
    if (!tier) return;
    setSavingLevel(level);
    await updateCommissionSetting(tier.level, tier.percentage, tier.isActive);
    setSavingLevel(null);
    setSuccessLevel(level);
    setTimeout(() => setSuccessLevel(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Referral Hierarchy & Commission Governance</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure 10-level commission percentages and audit student referral relationships.
        </p>
      </div>

      {/* Compliance Mandate Callout */}
      <div className="p-4 rounded-xl bg-slate-900 border border-teal-800/80 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-teal-400">
          <ShieldAlert className="w-4 h-4 text-teal-400" />
          <span>Statutory Direct-Selling Safeguard:</span>
        </div>
        <p className="leading-relaxed">
          Commissions must not be disbursed from member registration deposits or recruitment bounties. Keep tiers in <strong>Configuration-Only Mode (Disabled)</strong> until formal direct-selling licensing and legal authorization is verified.
        </p>
      </div>

      {/* 10-Level Commission Tiers Configuration Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">10-Tier Commission Slabs</h3>
            <p className="text-xs text-slate-400 mt-0.5">Adjust compensation percentages per generation.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Tier</th>
                <th className="py-2.5 px-3 font-semibold">Degree</th>
                <th className="py-2.5 px-3 font-semibold">Commission %</th>
                <th className="py-2.5 px-3 font-semibold">Engine Disbursement State</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {tiers.map((t) => (
                <tr key={t.level} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-bold text-white">Level {t.level}</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {t.level === 1 ? "Direct Referrals" : t.level === 2 ? "2nd Tier" : t.level === 3 ? "3rd Tier" : "Downline Network"}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 w-28">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        value={t.percentage}
                        onChange={(e) => handlePercentageChange(t.level, e.target.value)}
                        className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-teal-400 text-right"
                      />
                      <span className="text-slate-400 font-semibold">%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(t.level, t.isActive)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        t.isActive
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                      }`}
                    >
                      {t.isActive ? "ENABLED (LIVE)" : "DISABLED (AUDIT ONLY)"}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => saveTier(t.level)}
                      disabled={savingLevel === t.level}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      {successLevel === t.level ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" />
                          <span>Update</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Referral Linkages Audit Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Student Sponsor Linkage Records</h3>
            <p className="text-xs text-slate-400 mt-0.5">Parent-child referral associations recorded in database.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{referralRelations.length} Linkages</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Student ID</th>
                <th className="py-2.5 px-3 font-semibold">Student Name</th>
                <th className="py-2.5 px-3 font-semibold">Sponsor ID</th>
                <th className="py-2.5 px-3 font-semibold">Sponsor Name</th>
                <th className="py-2.5 px-3 font-semibold">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {referralRelations.map((rel) => (
                <tr key={rel.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-400">{rel.uniqueUserId}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{rel.fullName}</td>
                  <td className="py-2.5 px-3 font-mono text-amber-400">{rel.referrer?.uniqueUserId}</td>
                  <td className="py-2.5 px-3 text-slate-300">{rel.referrer?.fullName}</td>
                  <td className="py-2.5 px-3 text-slate-400">{formatDate(rel.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
