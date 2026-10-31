"use client";

import { useState } from "react";
import Link from "next/link";
import { createTicket } from "@/app/actions/support";
import { formatDateTime } from "@/lib/utils";
import { HelpCircle, Plus, Send, AlertCircle, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";

export default function SupportClientView({
  user,
  tickets,
}: {
  user: any;
  tickets: any[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Payment");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("category", category);
    formData.append("priority", priority);
    formData.append("message", message);

    const res = await createTicket(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create ticket.");
    } else {
      setShowModal(false);
      setSubject("");
      setMessage("");
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Support Desk</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit questions regarding blockchain payment verifications, curriculum inquiries, or technical support.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {/* Ticket Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="finance-card p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Support Inquiry</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Payment">Payment & Verification</option>
                  <option value="Course">Curriculum & Educational Inquiry</option>
                  <option value="Account">Account Credentials & Mobile Number</option>
                  <option value="Technical">Platform Technical Issue</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Verification status of my $20 USDT transfer"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue with TXID or relevant details..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {loading ? <span>Submitting...</span> : <span>Create Ticket</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Your Support Inquiries</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tickets logged with compliance and course directors.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{tickets.length} Total</span>
        </div>

        {tickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No support tickets on file. Click &quot;Open Support Ticket&quot; if you need assistance.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {tickets.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-400">{t.ticketNumber}</span>
                    <span className="text-xs font-semibold text-white">{t.subject}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Category: <strong>{t.category}</strong></span>
                    <span>&bull;</span>
                    <span>Updated: {formatDateTime(t.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      t.status === "RESOLVED" || t.status === "CLOSED"
                        ? "bg-slate-800 text-slate-400 border border-slate-700"
                        : t.status === "IN_PROGRESS"
                        ? "bg-teal-950 text-teal-400 border border-teal-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {t.status}
                  </span>

                  <Link
                    href={`/dashboard/support/${t.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View Thread</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
