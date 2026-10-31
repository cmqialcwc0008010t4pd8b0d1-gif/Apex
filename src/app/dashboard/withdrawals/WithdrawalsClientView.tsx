"use client";

import { useState } from "react";
import { requestWithdrawal } from "@/app/actions/wallet";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ArrowDownToLine,
  ShieldAlert,
  Wallet,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function WithdrawalsClientView({
  user,
  wallet,
  withdrawalsEnabled,
  withdrawalRequests,
}: {
  user: any;
  wallet: any;
  withdrawalsEnabled: boolean;
  withdrawalRequests: any[];
}) {
  const [amount, setAmount] = useState("10");
  const [network, setNetwork] = useState<"BEP20" | "TRC20">("BEP20");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const availableBalance = wallet?.balance || 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("network", network);
    formData.append("walletAddress", walletAddress);

    const res = await requestWithdrawal(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to process withdrawal request.");
    } else {
      setSuccess(`Withdrawal request #${res.data?.requestNumber} submitted to compliance.`);
      setWalletAddress("");
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Withdrawal Requests & Payouts</h2>
        <p className="text-xs text-slate-400 mt-1">
          Request disbursement of verified affiliate commissions to your external blockchain wallet.
        </p>
      </div>

      {/* Compliance Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-teal-800/80 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-teal-400">
          <ShieldAlert className="w-4 h-4 text-teal-400" />
          <span>Disbursement Governance & Compliance Standards</span>
        </div>
        <p className="leading-relaxed">
          Withdrawals are processed manually following strict double-verification of account activity. To ensure anti-money laundering (AML) and direct-selling compliance, system withdrawals are presently maintained in <strong>Configuration/Test Mode</strong>. Minimum request threshold: <strong>$10.00 USDT</strong>.
        </p>
      </div>

      {/* Request Form & Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left balance card */}
        <div className="md:col-span-1 finance-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Available for Payout</span>
            <div className="text-3xl font-extrabold text-white">{formatCurrency(availableBalance)}</div>
            <p className="text-xs text-slate-400">
              Locked in Pending Queue: <strong className="text-amber-400">{formatCurrency(wallet?.pendingWithdrawals || 0)}</strong>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
            <div>&bull; Minimum: <strong>$10.00 USDT</strong></div>
            <div>&bull; Weekly settlement frequency</div>
            <div>&bull; Zero platform gas deductions</div>
          </div>
        </div>

        {/* Right withdrawal form */}
        <div className="md:col-span-2 finance-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Create New Withdrawal Request</h3>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Amount (USDT)</label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max={availableBalance > 10 ? availableBalance : 10}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="BEP20">BNB Smart Chain (BEP20)</option>
                  <option value="TRC20">Tron Network (TRC20)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Receiving Wallet Address</label>
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="e.g. 0x... or T..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || availableBalance < 10}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
            >
              {loading ? (
                <span>Locking Balance & Submitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Withdrawal Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Requests History Table */}
      <div className="finance-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Withdrawal History & Audited References</h3>
          <p className="text-xs text-slate-400 mt-0.5">Track your submitted payouts, admin reviews, and on-chain tx references.</p>
        </div>

        {withdrawalRequests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No withdrawal requests submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Request #</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Network</th>
                  <th className="py-3 px-3 font-semibold">Destination Wallet</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Payout Reference</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {withdrawalRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono font-bold text-teal-400">{req.requestNumber}</td>
                    <td className="py-3 px-3 font-bold text-white">${req.amount.toFixed(2)} {req.currency}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{req.network}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 truncate max-w-[120px]" title={req.walletAddress}>
                      {req.walletAddress.slice(0, 8)}...{req.walletAddress.slice(-6)}
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
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {req.paymentReference ? req.paymentReference : <span className="italic text-slate-600">Pending audit</span>}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatDateTime(req.requestedAt)}</td>
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
