import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Receipt, ShieldCheck } from "lucide-react";

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const transactions = await prisma.financialTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Complete Financial Ledger</h2>
        <p className="text-xs text-slate-400 mt-1">
          Immutable double-entry ledger archive. Every financial adjustment creates an audited record.
        </p>
      </div>

      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Ledger Entries</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sequential cryptographically tracked balance operations.</p>
          </div>
          <span className="text-xs font-mono text-teal-400">{transactions.length} Total Records</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No ledger transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Tx Code</th>
                  <th className="py-3 px-3 font-semibold">Category</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Balance After</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Description</th>
                  <th className="py-3 px-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono text-slate-400">{t.transactionCode}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-3 px-3 font-bold ${t.amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.amount >= 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{formatCurrency(t.balanceAfter)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={t.description}>
                      {t.description}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(t.createdAt)}</td>
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
