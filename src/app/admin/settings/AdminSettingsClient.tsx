"use client";

import { useState } from "react";
import { updatePlatformSettings } from "@/app/actions/admin";
import { Settings, Save, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminSettingsClient({ setting }: { setting: any }) {
  const [siteName, setSiteName] = useState(setting?.siteName || "ApexEdge Trading Academy");
  const [supportEmail, setSupportEmail] = useState(setting?.supportEmail || "support@apexedgetrading.internal");
  const [supportPhone, setSupportPhone] = useState(setting?.supportPhone || "+1-800-APEX-EDU");
  const [membershipPrice, setMembershipPrice] = useState(setting?.membershipPrice?.toString() || "20");
  const [maintenanceMode, setMaintenanceMode] = useState(setting?.maintenanceMode || false);
  const [registrationEnabled, setRegistrationEnabled] = useState(setting?.registrationEnabled ?? true);
  const [withdrawalsEnabled, setWithdrawalsEnabled] = useState(setting?.withdrawalsEnabled || false);
  const [complianceHoldEnabled, setComplianceHoldEnabled] = useState(setting?.complianceHoldEnabled ?? true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData();
    formData.append("siteName", siteName);
    formData.append("supportEmail", supportEmail);
    formData.append("supportPhone", supportPhone);
    formData.append("membershipPrice", membershipPrice);
    formData.append("maintenanceMode", maintenanceMode ? "true" : "false");
    formData.append("registrationEnabled", registrationEnabled ? "true" : "false");
    formData.append("withdrawalsEnabled", withdrawalsEnabled ? "true" : "false");
    formData.append("complianceHoldEnabled", complianceHoldEnabled ? "true" : "false");

    const res = await updatePlatformSettings(formData);
    setLoading(false);

    if (res.success) {
      setMsg("Platform settings saved successfully!");
      setTimeout(() => setMsg(null), 2500);
    } else {
      setMsg(res.error || "Failed to update platform settings.");
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Global Platform Governance Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure site identity, membership pricing, maintenance modes, and regulatory compliance switches.
        </p>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="finance-card p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800">
          Core Academy Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Academy Name *</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Lifetime Membership Price (USD) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={membershipPrice}
              onChange={(e) => setMembershipPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Compliance Support Email</label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Telephone Helpline</label>
            <input
              type="text"
              required
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>

        <h3 className="text-base font-bold text-white pt-4 pb-2 border-b border-slate-800">
          Operational Security & Compliance Toggles
        </h3>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="mt-1 rounded border-slate-700 text-teal-600 focus:ring-0"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white">System Maintenance Mode</span>
              <p className="text-[11px] text-slate-400">
                When enabled, pauses external logins and displays maintenance advisory banner.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={registrationEnabled}
              onChange={(e) => setRegistrationEnabled(e.target.checked)}
              className="mt-1 rounded border-slate-700 text-teal-600 focus:ring-0"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white">Public Student Registration Active</span>
              <p className="text-[11px] text-slate-400">
                Permits prospective students to submit new registrations and generate unique student IDs.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={withdrawalsEnabled}
              onChange={(e) => setWithdrawalsEnabled(e.target.checked)}
              className="mt-1 rounded border-slate-700 text-teal-600 focus:ring-0"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white">Student Withdrawal Disbursements Active</span>
              <p className="text-[11px] text-slate-400">
                Keep unchecked (disabled) until tax, KYC, and regulatory direct-selling requirements are configured.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={complianceHoldEnabled}
              onChange={(e) => setComplianceHoldEnabled(e.target.checked)}
              className="mt-1 rounded border-slate-700 text-teal-600 focus:ring-0"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white">Multi-Tier Compliance Hold Active</span>
              <p className="text-[11px] text-slate-400">
                Enforces configuration-only mode on multi-level commissions to prevent unauthorized MLM distributions.
              </p>
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving Settings..." : "Save Global Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
