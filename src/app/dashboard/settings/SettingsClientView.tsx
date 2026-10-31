"use client";

import { useState } from "react";
import { changePassword } from "@/app/actions/settings";
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, User } from "lucide-react";

export default function SettingsClientView({ user }: { user: any }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);

    const res = await changePassword(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to update password.");
    } else {
      setSuccess("Your account password has been updated securely.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Security & Account Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your credentials, password security, and active session preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Update Card */}
        <div className="finance-card p-6 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-bold text-base pb-2 border-b border-slate-800">
            <Lock className="w-5 h-5 text-teal-400" />
            <span>Update Account Password</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter existing password"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
            >
              {loading ? <span>Updating Hash...</span> : <span>Save New Password</span>}
            </button>
          </form>
        </div>

        {/* Security Disclosures Card */}
        <div className="finance-card p-6 space-y-5">
          <div className="flex items-center gap-2.5 text-white font-bold text-base pb-2 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span>Account Security Governance</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-semibold text-white mb-0.5">Cryptographic Hashing</div>
              <p className="text-slate-400">Passwords are salted and hashed using bcrypt. Our servers never store plain-text passwords.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-semibold text-white mb-0.5">Session Integrity</div>
              <p className="text-slate-400">HttpOnly signed JWT cookies prevent cross-site scripting (XSS) credential theft.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-semibold text-white mb-0.5">Immutable Student Identification</div>
              <p className="text-slate-400">Your Unique Student ID (<strong>{user.uniqueUserId}</strong>) is permanently bound to your account and cannot be altered.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
