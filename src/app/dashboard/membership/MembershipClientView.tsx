"use client";

import { useState } from "react";
import { submitPaymentRequest } from "@/app/actions/payment";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Copy,
  Check,
  AlertTriangle,
  QrCode,
  Send,
  ExternalLink,
  Receipt,
  FileCheck2,
} from "lucide-react";

export default function MembershipClientView({
  user,
  paymentSetting,
  paymentRequests,
}: {
  user: any;
  paymentSetting: any;
  paymentRequests: any[];
}) {
  const [selectedNetwork, setSelectedNetwork] = useState<"BEP20" | "TRC20">("BEP20");
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeWalletAddress =
    selectedNetwork === "BEP20"
      ? paymentSetting?.bep20Address || "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
      : paymentSetting?.trc20Address || "TX9qZVa59z6W24Y2D6F7gK1mR3o9H7jL8w";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("network", selectedNetwork);
    formData.append("txHash", txHash);
    formData.append("receivingAddress", activeWalletAddress);

    const res = await submitPaymentRequest(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to submit request.");
    } else {
      setSuccess("Your payment request has been submitted and is currently UNDER REVIEW.");
      setTxHash("");
    }
  }

  const isMemberActive = user.membershipStatus === "ACTIVE";

  return (
    <div className="max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Membership Activation Desk</h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete your manual $20 payment verification to unlock full institutional syllabus privileges.
        </p>
      </div>

      {/* Current Status Card */}
      <div className="finance-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isMemberActive
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : user.membershipStatus === "UNDER_REVIEW"
                ? "bg-sky-950 text-sky-400 border border-sky-800"
                : "bg-amber-950 text-amber-400 border border-amber-800"
            }`}
          >
            {isMemberActive ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>

          <div className="space-y-0.5">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Standing</div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>{user.membershipStatus}</span>
              {isMemberActive && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Full Access
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isMemberActive
                ? "Your membership is active. You have full access to all articles and interactive simulators."
                : user.membershipStatus === "UNDER_REVIEW"
                ? "Payment verification in progress. Our treasury compliance officers are auditing your on-chain transaction."
                : "Awaiting your manual transfer and transaction hash submission."}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xs text-slate-400">Access Fee</div>
          <div className="text-2xl font-extrabold text-white">${paymentSetting?.amount || 20} USD</div>
          <div className="text-[10px] text-teal-400">Lifetime Pass</div>
        </div>
      </div>

      {/* Manual Payment Instructions & Form (Show if not active or if submitting another) */}
      {!isMemberActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instructions Column */}
          <div className="finance-card p-6 space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">Step 1 &bull; Transfer Funds</span>
              <h3 className="text-base font-bold text-white">Select Blockchain Network</h3>
            </div>

            {/* Network Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedNetwork("BEP20")}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  selectedNetwork === "BEP20"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                BNB Smart Chain (BEP20)
              </button>
              <button
                type="button"
                onClick={() => setSelectedNetwork("TRC20")}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  selectedNetwork === "TRC20"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tron Network (TRC20)
              </button>
            </div>

            {/* Wallet Address Display with Copy Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Official {selectedNetwork} Treasury Address
              </label>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-teal-300 break-all select-all">
                  {activeWalletAddress}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors"
                  title="Copy Wallet Address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Send exactly <strong>${paymentSetting?.amount || 20} USDT</strong> to this address.
              </p>
            </div>

            {/* Review Window & Warning Notice */}
            <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/80 text-xs text-amber-200/90 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Estimated Review Window: 2 - 3 Hours</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Verification is conducted manually by treasury officers. Screenshots alone do not activate access. We independently audit transaction hashes against the public explorer.
              </p>
            </div>
          </div>

          {/* Submission Form Column */}
          <div className="finance-card p-6 space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">Step 2 &bull; Submit Proof</span>
              <h3 className="text-base font-bold text-white">Provide Transaction Details</h3>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Selected Network</label>
                <input
                  type="text"
                  readOnly
                  value={selectedNetwork}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-teal-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Transaction Hash (TXID) *</label>
                <input
                  type="text"
                  required
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste complete 64-character hash..."
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
                <p className="text-[10px] text-slate-400">
                  Example: 0x4a9b6c8d1e2f3a4b... Duplicate hashes will be rejected.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Payment Screenshot / Receipt Reference</label>
                <div className="p-3 rounded-lg border border-dashed border-slate-700 bg-slate-900/60 text-center space-y-1">
                  <Receipt className="w-5 h-5 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-300 font-medium">Receipt Attached (Default Protocol)</div>
                  <div className="text-[10px] text-slate-400">Attached automatically with your TXID submission</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !txHash}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
              >
                {loading ? (
                  <span>Recording Payment Request...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Payment for Review</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Requests History Table */}
      <div className="finance-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Payment Request History</h3>
          <p className="text-xs text-slate-400 mt-0.5">Audited records of your manual transfer submissions.</p>
        </div>

        {paymentRequests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No payment requests submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Date</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Network</th>
                  <th className="py-3 px-3 font-semibold">TXID</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Admin Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {paymentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 whitespace-nowrap text-slate-400">{formatDateTime(req.createdAt)}</td>
                    <td className="py-3 px-3 font-bold text-white">${req.amount} {req.currency}</td>
                    <td className="py-3 px-3 font-mono text-teal-400">{req.network}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 truncate max-w-[120px]" title={req.txHash}>
                      {req.txHash.slice(0, 10)}...{req.txHash.slice(-6)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "APPROVED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : req.status === "UNDER_REVIEW" || req.status === "SUBMITTED"
                            ? "bg-sky-950 text-sky-400 border border-sky-800"
                            : req.status === "REJECTED"
                            ? "bg-rose-950 text-rose-400 border border-rose-800"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate" title={req.adminNotes || "None"}>
                      {req.adminNotes || "Pending review"}
                    </td>
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
