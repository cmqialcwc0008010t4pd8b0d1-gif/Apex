"use client";

import { useState } from "react";
import Link from "next/link";
import { submitPasswordResetRequest } from "@/app/actions/auth";
import { ShieldCheck, Phone, User, Send, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await submitPasswordResetRequest(formData);

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to submit recovery request.");
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            APEX<span className="text-teal-400">EDGE</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">Account Recovery Desk</h2>
        <p className="text-xs text-slate-400">
          Admin-assisted credential verification without paid 3rd-party SMS gateways.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="finance-card p-8 sm:p-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-teal-950 border border-teal-800 text-teal-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Recovery Ticket Created</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your recovery request has been logged into the compliance support desk. Our administrator will review your account records and contact you on your registered mobile number.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Registered Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    placeholder="+12025550101"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Unique Student ID (If Known)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="uniqueUserId"
                    placeholder="e.g. EDU100001"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white uppercase focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Recovery Notes</label>
                <textarea
                  name="explanation"
                  rows={3}
                  placeholder="Provide approximate date of registration or last accessed course to facilitate verification..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/30"
              >
                {loading ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Recovery Request</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
