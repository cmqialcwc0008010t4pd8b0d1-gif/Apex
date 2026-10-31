import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { TrendingUp, ShieldAlert } from "lucide-react";

export default async function EarningsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const commissionRecords = await prisma.commissionRecord.findMany({
    where: { beneficiaryUserId: user.id },
    include: {
      sourceUser: {
        select: { uniqueUserId: true, fullName: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Referral Commission Earnings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Audited record of multi-tier commission calculations and legal compliance holds.
        </p>
      </div>

      {/* Compliance Note */}
      <div className="p-4 rounded-xl bg-slate-900 border border-teal-800/80 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-teal-400">
          <ShieldAlert className="w-4 h-4 text-teal-400" />
          <span>Compliance Hold Status: Active</span>
        </div>
        <p className="leading-relaxed">
          In strict accordance with direct-selling anti-pyramid consumer protection guidelines, multi-tier commission disbursements remain disabled until formal corporate authorization. All calculations are recorded immutably in this audit ledger.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Calculated</div>
          <div className="text-2xl font-bold text-teal-400">{formatCurrency(user.walletAccount?.totalEarned || 0)}</div>
          <div className="text-[10px] text-slate-400">Lifetime Ledger Accrual</div>
        </div>

        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Held in Compliance</div>
          <div className="text-2xl font-bold text-amber-400">{formatCurrency(user.walletAccount?.totalEarned || 0)}</div>
          <div className="text-[10px] text-amber-400/80">Pending Regulatory Audit</div>
        </div>

        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Disbursed</div>
          <div className="text-2xl font-bold text-slate-300">{formatCurrency(0)}</div>
          <div className="text-[10px] text-slate-400">Released to Wallet</div>
        </div>
      </div>

      {/* Commission Audit Records Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Calculated Commission Records</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated calculations generated per network enrollment.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{commissionRecords.length} Records</span>
        </div>

        {commissionRecords.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No referral commission records logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Tier Level</th>
                  <th className="py-3 px-3 font-semibold">Source Student</th>
                  <th className="py-3 px-3 font-semibold">Commission %</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Audit Notes</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {commissionRecords.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-bold text-teal-400">Level {c.level}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {c.sourceUser.fullName} ({c.sourceUser.uniqueUserId})
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{c.percentage}%</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">${c.amount.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={c.auditNotes}>
                      {c.auditNotes}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatDateTime(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
