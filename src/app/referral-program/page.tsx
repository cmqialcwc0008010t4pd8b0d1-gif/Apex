import Link from "next/link";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { Users, ShieldAlert, Award, Network, CheckCircle, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReferralProgramPage() {
  let commissionSettings: any[] = [];
  try {
    commissionSettings = await prisma.commissionSetting.findMany({
      orderBy: { level: "asc" },
    });
  } catch (err) {
    console.error("Referral program fallback:", err);
    commissionSettings = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Community Growth Model</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Referral Program & Team Architecture</h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Transparent, audited multi-tier referral tracking designed to reward community educators and platform advocates.
            </p>
          </div>

          {/* Compliance & Legal Hold Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-teal-800/80 space-y-3">
            <div className="flex items-center gap-2.5 text-teal-400 font-semibold text-sm">
              <ShieldAlert className="w-5 h-5 text-teal-400" />
              <span>Regulatory Compliance & Anti-Pyramid Safeguards</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ApexEdge Trading Academy enforces strict adherence to international direct-selling, trade practice, and consumer protection guidelines. Referral rewards are never funded by new-member deposits or mere recruitment bounties. The commission disbursement engine is currently maintained in <strong>Configuration & Audit-Only Mode</strong> until full regulatory authorization is formalized. All calculations are recorded immutably for audit purposes.
            </p>
          </div>

          {/* Proposed Tier Distribution Table */}
          <div className="finance-card p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Proposed Multi-Level Commission Structure</h2>
              <p className="text-xs text-slate-400 mt-1">Configurable tiers established under the educational affiliate governance policy.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4 font-semibold">Tier Level</th>
                    <th className="py-3 px-4 font-semibold">Relationship Type</th>
                    <th className="py-3 px-4 font-semibold">Proposed Commission %</th>
                    <th className="py-3 px-4 font-semibold">Engine Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {commissionSettings.map((c) => (
                    <tr key={c.level} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-bold text-white">Level {c.level}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {c.level === 1 ? "Direct Referrals (1st Degree)" : c.level === 2 ? "2nd Degree Team Member" : c.level === 3 ? "3rd Degree Team Member" : "Extended Network"}
                      </td>
                      <td className="py-3 px-4 font-bold text-teal-400">{c.percentage}%</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          {c.isActive ? "ACTIVE" : "COMPLIANCE HOLD"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Program Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="finance-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Interactive Network Visualizer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor your entire organization from Level 1 down to Level 10 directly inside your student dashboard. Inspect registration timestamps and verified account statuses.
              </p>
            </div>

            <div className="finance-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Team Performance Slabs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configurable weekly achievement tiers (Bronze, Silver, Gold) designed to acknowledge student mentors who actively conduct study circles and risk management seminars.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-teal-600/30"
            >
              <span>Get Your Unique Referral Link</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
