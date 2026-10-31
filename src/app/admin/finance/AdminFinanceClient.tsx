"use client";

import { useState } from "react";
import { approveWithdrawalRequest, rejectWithdrawalRequest } from "@/app/actions/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Wallet, ArrowDownToLine, Receipt, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function AdminFinanceClient({
  transactions,
  withdrawalRequests,
  verifiedRevenue,
  totalWithdrawn,
  totalRefunds,
}: {
  transactions: any[];
  withdrawalRequests: any[];
  verifiedRevenue: number;
  totalWithdrawn: number;
  totalRefunds: number;
}) {
  const [activeTab, setActiveTab] = useState<"WITHDRAWALS" | "LEDGER">("WITHDRAWALS");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Approve modal state
  const [approveModalId, setApproveModalId] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState("");

  // Reject modal state
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    if (!approveModalId) return;

    setLoadingId(approveModalId);
    await approveWithdrawalRequest(approveModalId, paymentReference);
    setLoadingId(null);
    setApproveModalId(null);
    setPaymentReference("");
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectModalId || !rejectReason.trim()) return;

    setLoadingId(rejectModalId);
    await rejectWithdrawalRequest(rejectModalId, rejectReason);
    setLoadingId(null);
    setRejectModalId(null);
    setRejectReason("");
  }

  const netTreasury = verifiedRevenue - totalWithdrawn;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Financial Treasury & Double-Entry Ledger</h2>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically audited financial records, verified educational sales revenue, and manual withdrawal disbursements.
        </p>
      </div>

      {/* Approve Modal */}
      {approveModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="finance-card p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Execute Withdrawal Disbursement</h3>
            <p className="text-xs text-slate-400">
              Record the external blockchain payment transaction hash or banking reference.
            </p>

            <form onSubmit={handleApprove} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Payment Reference / TXID *</label>
                <input
                  type="text"
                  required
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. 0x9b4a... or TRC20 TXID"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApproveModalId(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingId === approveModalId}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Confirm Payout Execution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="finance-card p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Reject Withdrawal Request</h3>
            <p className="text-xs text-slate-400">
              Provide an audited rejection reason. Funds will be unlocked and refunded to the student&apos;s available balance.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Rejection Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Invalid receiving network or compliance verification required..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalId(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingId === rejectModalId}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Confirm Rejection & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Treasury Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="finance-card p-5 space-y-1 bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-800/80">
          <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Total Verified Revenue</div>
          <div className="text-2xl font-extrabold text-white">{formatCurrency(verifiedRevenue)}</div>
          <div className="text-[10px] text-slate-400">On-Chain Verified Memberships</div>
        </div>

        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Payouts Disbursed</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalWithdrawn)}</div>
          <div className="text-[10px] text-slate-400">Executed Withdrawals</div>
        </div>

        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Refunds Processed</div>
          <div className="text-2xl font-bold text-amber-400">{formatCurrency(totalRefunds)}</div>
          <div className="text-[10px] text-slate-400">Returned Balances</div>
        </div>

        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Retained Treasury</div>
          <div className="text-2xl font-bold text-teal-400">{formatCurrency(netTreasury)}</div>
          <div className="text-[10px] text-teal-400 font-medium">Solvent Reserve</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("WITHDRAWALS")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "WITHDRAWALS" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>Withdrawal Review Queue ({withdrawalRequests.filter((w) => w.status === "PENDING").length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab("LEDGER")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "LEDGER" ? "bg-teal-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Master Accounting Ledger ({transactions.length})</span>
        </button>
      </div>

      {/* Tab 1: Withdrawal Requests Processing Table */}
      {activeTab === "WITHDRAWALS" && (
        <div className="finance-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Student Withdrawal Requests</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audit student payout requests, verify balances, and record payment references.</p>
            </div>
          </div>

          {withdrawalRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No withdrawal requests recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3 font-semibold">Request #</th>
                    <th className="py-3 px-3 font-semibold">Student ID</th>
                    <th className="py-3 px-3 font-semibold">Student Name</th>
                    <th className="py-3 px-3 font-semibold">Amount</th>
                    <th className="py-3 px-3 font-semibold">Network</th>
                    <th className="py-3 px-3 font-semibold">Destination Wallet</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                    <th className="py-3 px-3 font-semibold text-right">Disbursement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {withdrawalRequests.map((req) => {
                    const isPending = req.status === "PENDING";
                    return (
                      <tr key={req.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-3 font-mono font-bold text-amber-400">{req.requestNumber}</td>
                        <td className="py-3 px-3 font-mono text-teal-400 font-bold">{req.user.uniqueUserId}</td>
                        <td className="py-3 px-3 font-semibold text-white">{req.user.fullName}</td>
                        <td className="py-3 px-3 font-bold text-white">${req.amount.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono text-slate-300">{req.network}</td>
                        <td className="py-3 px-3 font-mono text-slate-400 truncate max-w-[140px]" title={req.walletAddress}>
                          {req.walletAddress}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              req.status === "APPROVED"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : req.status === "PENDING"
                                ? "bg-amber-950 text-amber-400 border border-amber-800"
                                : "bg-rose-950 text-rose-400 border border-rose-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setApproveModalId(req.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-[11px] transition-colors"
                              >
                                Disburse
                              </button>
                              <button
                                onClick={() => setRejectModalId(req.id)}
                                className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white font-semibold rounded text-[11px] transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500">
                              {req.paymentReference || "Settled"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Master Accounting Ledger Table */}
      {activeTab === "LEDGER" && (
        <div className="finance-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Immutable Double-Entry Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">Chronological system accounting records.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Tx Code</th>
                  <th className="py-3 px-3 font-semibold">Student ID</th>
                  <th className="py-3 px-3 font-semibold">Category</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Balance After</th>
                  <th className="py-3 px-3 font-semibold">Description</th>
                  <th className="py-3 px-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono text-slate-400">{t.transactionCode}</td>
                    <td className="py-3 px-3 font-mono font-bold text-teal-400">{t.user?.uniqueUserId}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-3 px-3 font-bold ${t.amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.amount >= 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{formatCurrency(t.balanceAfter)}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={t.description}>
                      {t.description}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
