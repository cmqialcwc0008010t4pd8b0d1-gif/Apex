"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import { ShieldCheck, Phone, Lock, ArrowRight, AlertCircle, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("mobileNumber", mobileNumber);
    formData.append("password", password);

    const res = await loginUser(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to sign in.");
    } else {
      if (res.data?.role === "SUPER_ADMIN" || res.data?.role === "FINANCE_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }

  // Helper to fill demo credentials
  const fillCredentials = (m: string, p: string) => {
    setMobileNumber(m);
    setPassword(p);
    setError(null);
  };

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
        <h2 className="text-2xl font-bold text-white tracking-tight">Portal Authentication</h2>
        <p className="text-xs text-slate-400">
          Enter your registered mobile number or Unique Student ID.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Mobile Number or Unique ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+12025550101 or EDU100001"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-teal-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/30"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-center">
              One-Click Testing Accounts
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillCredentials("+10000000000", "Admin@Trading2026!")}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-white">Super Admin</div>
                <div className="text-[10px] text-slate-400">EDU100000</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("+12025550101", "Student@123")}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-white">Active Student</div>
                <div className="text-[10px] text-slate-400">EDU100001</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-teal-400 hover:text-teal-300">
              Create Student Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
