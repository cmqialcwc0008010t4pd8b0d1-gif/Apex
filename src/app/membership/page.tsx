import Link from "next/link";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, Wallet, Hash, FileCheck } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function MembershipPage() {
  const paymentSetting = await prisma.paymentSetting.findFirst();

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Account Activation Protocol</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Membership & Manual Verification</h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Our transparent $20 one-time membership gives you lifetime access to all articles, interactive simulators, and daily lessons.
            </p>
          </div>

          {/* Pricing Highlight Card */}
          <div className="finance-card p-8 md:p-10 border-teal-800/60 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Single Tier Access
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2">Lifetime Academy Pass</h2>
                <p className="text-xs text-slate-400 mt-1">Full access to articles, interactive engines, and daily learning.</p>
              </div>

              <div className="text-right sm:text-right">
                <div className="text-4xl font-extrabold text-white">${paymentSetting?.amount || 20}</div>
                <div className="text-xs text-slate-400 font-medium">One-Time Manual Transfer</div>
              </div>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Unrestricted access to all present and upcoming written articles</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>All 8 interactive simulation games and knowledge challenges</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Personalized Daily Learning streak tracking and unlock progression</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Unique Student ID and personal dashboard analytics</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Estimated Treasury Verification: <strong>2 - 3 Hours</strong></span>
              </div>
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Register & Begin Activation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 16-Step Verification Workflow Breakdown */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">The 5-Phase Activation Workflow</h2>
              <p className="text-xs text-slate-400 mt-1">To ensure regulatory compliance and prevent fraudulent submissions, all memberships are manually audited.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="finance-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs">1</div>
                  <h3 className="font-semibold text-white text-sm">Account Creation</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign up with your normalized mobile number and receive a permanent unique student identifier (e.g. EDU100001).
                </p>
              </div>

              <div className="finance-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs">2</div>
                  <h3 className="font-semibold text-white text-sm">Review Wallet Configuration</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Navigate to &quot;My Membership&quot; in your student portal to see the official configured receiving address for BEP20 or TRC20 networks.
                </p>
              </div>

              <div className="finance-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs">3</div>
                  <h3 className="font-semibold text-white text-sm">External Blockchain Transfer</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transfer exactly $20 USDT from your external wallet or exchange. Never send funds directly from an unverified 3rd-party contract.
                </p>
              </div>

              <div className="finance-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs">4</div>
                  <h3 className="font-semibold text-white text-sm">Submit TXID & Screenshot</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Paste the full blockchain transaction hash and upload your transfer confirmation receipt. Your status transitions to &quot;Under Review&quot;.
                </p>
              </div>
            </div>

            {/* Compliance Guarantee Warning */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/80 text-xs text-amber-200/90 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-white">Manual Verification Notice:</div>
                <p>
                  No membership is activated automatically upon screenshot upload. Our treasury officers independently verify the transaction hash, receiving address, blockchain network, and exact dollar amount on the public explorer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
