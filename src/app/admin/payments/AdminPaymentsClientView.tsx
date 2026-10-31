"use client";

import { useState } from "react";
import { approvePaymentRequest, rejectPaymentRequest, updatePaymentSettings } from "@/app/actions/admin";
import { formatDateTime } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Settings,
  Save,
  Check,
} from "lucide-react";

export default function AdminPaymentsClientView({
  paymentRequests,
  paymentSetting,
}: {
  paymentRequests: any[];
  paymentSetting: any;
}) {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Payment settings state
  const [amount, setAmount] = useState(paymentSetting?.amount?.toString() || "20");
  const [bep20Address, setBep20Address] = useState(paymentSetting?.bep20Address || "");
  const [trc20Address, setTrc20Address] = useState(paymentSetting?.trc20Address || "");
  const [instructions, setInstructions] = useState(paymentSetting?.instructions || "");
  const [reviewWindowNotice, setReviewWindowNotice] = useState(paymentSetting?.reviewWindowNotice || "");
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  const filteredRequests = paymentRequests.filter((req) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return ["PENDING", "UNDER_REVIEW", "SUBMITTED"].includes(req.status);
    return req.status === filter;
  });

  async function handleApprove(requestId: string) {
    if (!confirm("Confirm on-chain receipt of this payment? This will activate the student's membership.")) return;
    setActionLoading(requestId);
    await approvePaymentRequest(requestId, "Verified on public blockchain explorer by admin.");
    setActionLoading(null);
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectModalId || !rejectReason.trim()) return;

    setActionLoading(rejectModalId);
    await rejectPaymentRequest(rejectModalId, rejectReason);
    setActionLoading(null);
    setRejectModalId(null);
    setRejectReason("");
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSuccess(false);

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("bep20Address", bep20Address);
    formData.append("trc20Address", trc20Address);
    formData.append("bep20Active", "true");
    formData.append("trc20Active", "true");
    formData.append("instructions", instructions);
    formData.append("reviewWindowNotice", reviewWindowNotice);

    const res = await updatePaymentSettings(formData);
    setSettingsLoading(false);
    if (res.success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2500);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Manual Payment Verification & Wallet Desk</h2>
        <p className="text-xs text-slate-400 mt-1">
          Independently verify blockchain transaction hashes and configure student receiving wallet addresses.
        </p>
      </div>

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="finance-card p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Reject Payment Request</h3>
            <p className="text-xs text-slate-400">
              Provide an audited rejection reason explaining why the transaction was unverified.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Rejection Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. TXID not found on BSCScan or incorrect receiving address..."
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
                  disabled={actionLoading === rejectModalId}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Address Configuration Form */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Treasury Wallet Address Configuration</h3>
          </div>
          {settingsSuccess && (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Config Saved</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Membership Price (USD)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">BNB Smart Chain (BEP20) Address</label>
              <input
                type="text"
                required
                value={bep20Address}
                onChange={(e) => setBep20Address(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-teal-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tron (TRC20) Address</label>
              <input
                type="text"
                required
                value={trc20Address}
                onChange={(e) => setTrc20Address(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-teal-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Student Instructions Notice</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Audit Timeframe Notice</label>
              <input
                type="text"
                value={reviewWindowNotice}
                onChange={(e) => setReviewWindowNotice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={settingsLoading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Wallet Addresses</span>
            </button>
          </div>
        </form>
      </div>

      {/* Payment Requests Pipeline */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Manual Payment Auditing Queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">Filter by review status to approve or reject submissions.</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filter === "PENDING" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Pending Audit
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filter === "APPROVED" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filter === "REJECTED" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filter === "ALL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All Records
            </button>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No payment requests found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Student ID</th>
                  <th className="py-3 px-3 font-semibold">Student Name</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Network</th>
                  <th className="py-3 px-3 font-semibold">Transaction Hash (TXID)</th>
                  <th className="py-3 px-3 font-semibold">Submitted</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredRequests.map((req) => {
                  const isPending = ["PENDING", "UNDER_REVIEW", "SUBMITTED"].includes(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-mono font-bold text-teal-400">{req.user.uniqueUserId}</td>
                      <td className="py-3 px-3 font-semibold text-white">{req.user.fullName}</td>
                      <td className="py-3 px-3 font-bold text-white">${req.amount} {req.currency}</td>
                      <td className="py-3 px-3 font-mono text-amber-400">{req.network}</td>
                      <td className="py-3 px-3 font-mono text-slate-300 max-w-[140px] truncate" title={req.txHash}>
                        {req.txHash}
                      </td>
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(req.createdAt)}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            req.status === "APPROVED"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : req.status === "REJECTED"
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(req.id)}
                              disabled={actionLoading === req.id}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded text-[11px] transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectModalId(req.id)}
                              disabled={actionLoading === req.id}
                              className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold rounded text-[11px] transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            {req.status === "APPROVED" ? "Verified" : "Closed"}
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
    </div>
  );
}
