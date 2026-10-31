"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import { ShieldCheck, User, Phone, Lock, Gift, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialReferral = searchParams.get("ref") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create account.");
    } else {
      setSuccessId(res.data?.uniqueUserId || "EDU100000");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    }
  }

  return (
    <div className="finance-card p-8 sm:p-10 space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successId && (
        <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Account Created!</span>
          </div>
          <p>Your permanent Unique ID is <strong>{successId}</strong></p>
          <p className="text-[11px] text-slate-400">Redirecting to your student dashboard...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Full Legal Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Alexander Vance"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Mobile Number with Country Code */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Mobile Number (with country code)</label>
            <span className="text-[10px] text-teal-400">e.g. +1... / +91...</span>
          </div>
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
          <p className="text-[10px] text-slate-400">Normalized internationally to prevent duplicate accounts.</p>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Create Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="Minimum 6 characters"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Re-type your password"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Referral ID (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Referral ID or Code (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Gift className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="referralCode"
              defaultValue={initialReferral}
              placeholder="e.g. REF88101 or EDU100001"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white uppercase focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 leading-tight">
          By registering, you agree to our{" "}
          <Link href="/terms" className="text-teal-400 hover:underline">Terms of Service</Link> and{" "}
          <Link href="/risk-disclosure" className="text-amber-400 hover:underline">Risk Disclosure</Link>.
        </div>

        <button
          type="submit"
          disabled={loading || !!successId}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/30"
        >
          {loading ? (
            <span>Generating Unique Student ID...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-teal-400 hover:text-teal-300">
          Sign In to Student Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
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
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Student Account</h2>
        <p className="text-xs text-slate-400">
          Enrolls you into ApexEdge Academy with a permanent Unique Student Identifier.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense fallback={
          <div className="finance-card p-10 text-center text-slate-400 text-sm">
            Loading registration system...
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
