"use client";

import { useState } from "react";
import { updateBonusSlab } from "@/app/actions/bonus-admin";
import { Award, ShieldAlert, Save, Check } from "lucide-react";

export default function AdminBonusClient({
  bonusSlabs,
  bonusRecords,
}: {
  bonusSlabs: any[];
  bonusRecords: any[];
}) {
  const [slabs, setSlabs] = useState(bonusSlabs);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleFieldChange = (id: string, field: string, val: any) => {
    setSlabs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = async (id: string) => {
    const slab = slabs.find((s) => s.id === id);
    if (!slab) return;
    setSavingId(id);
    await updateBonusSlab(
      slab.id,
      slab.minDirectReferrals,
      slab.minTeamSize,
      slab.bonusAmount,
      slab.maintenanceDeductionPct,
      slab.isActive
    );
    setSavingId(null);
    setSuccessId(id);
    setTimeout(() => setSuccessId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Team Performance Bonus Management</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure weekly qualification rules, direct referral thresholds, and maintenance deductions.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-teal-800/80 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-teal-400">
          <ShieldAlert className="w-4 h-4 text-teal-400" />
          <span>Statutory Compliance Hold:</span>
        </div>
        <p className="leading-relaxed">
          Bonus payouts must never be distributed without verified corporate operating revenue. All slabs are maintained in configuration-only mode until authorized by corporate legal advisors.
        </p>
      </div>

      {/* Slabs Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slabs.map((slab) => (
          <div key={slab.id} className="finance-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">{slab.title}</span>
                <button
                  type="button"
                  onClick={() => handleFieldChange(slab.id, "isActive", !slab.isActive)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    slab.isActive
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {slab.isActive ? "ACTIVE" : "CONFIG ONLY"}
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Bonus Amount ($)</label>
                  <input
                    type="number"
                    value={slab.bonusAmount}
                    onChange={(e) => handleFieldChange(slab.id, "bonusAmount", parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Min Direct Referrals</label>
                  <input
                    type="number"
                    value={slab.minDirectReferrals}
                    onChange={(e) => handleFieldChange(slab.id, "minDirectReferrals", parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Min Total Team Members</label>
                  <input
                    type="number"
                    value={slab.minTeamSize}
                    onChange={(e) => handleFieldChange(slab.id, "minTeamSize", parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Maintenance Deduction (%)</label>
                  <input
                    type="number"
                    value={slab.maintenanceDeductionPct}
                    onChange={(e) => handleFieldChange(slab.id, "maintenanceDeductionPct", parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSave(slab.id)}
                disabled={savingId === slab.id}
                className="w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {successId === slab.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Config Updated</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Slab Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
