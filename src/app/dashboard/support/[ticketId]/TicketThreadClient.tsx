"use client";

import { useState } from "react";
import Link from "next/link";
import { sendTicketMessage } from "@/app/actions/support";
import { formatDateTime } from "@/lib/utils";
import { ChevronLeft, Send, ShieldCheck, User } from "lucide-react";

export default function TicketThreadClient({
  user,
  ticket,
}: {
  user: any;
  ticket: any;
}) {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("ticketId", ticket.id);
    formData.append("message", replyMessage);

    const res = await sendTicketMessage(formData);
    setLoading(false);

    if (res.success) {
      setReplyMessage("");
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Tickets</span>
        </Link>

        <span
          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            ticket.status === "RESOLVED"
              ? "bg-slate-800 text-slate-400 border border-slate-700"
              : "bg-teal-950 text-teal-400 border border-teal-800"
          }`}
        >
          {ticket.status}
        </span>
      </div>

      {/* Ticket Details Summary */}
      <div className="finance-card p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold">
          <span>{ticket.ticketNumber}</span>
          <span>&bull;</span>
          <span className="text-slate-400">{ticket.category}</span>
        </div>
        <h2 className="text-xl font-bold text-white leading-tight">{ticket.subject}</h2>
        <p className="text-xs text-slate-400">
          Opened by {ticket.user.fullName} ({ticket.user.uniqueUserId}) &bull; Priority: {ticket.priority}
        </p>
      </div>

      {/* Message History Thread */}
      <div className="finance-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
          Conversation Thread ({ticket.messages.length} Messages)
        </h3>

        <div className="space-y-4">
          {ticket.messages.map((m: any) => {
            const isAdmin = m.senderRole === "ADMIN" || m.senderRole === "SUPER_ADMIN";
            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl space-y-2 ${
                  isAdmin
                    ? "bg-teal-950/30 border border-teal-800/80 ml-4 sm:ml-8"
                    : "bg-slate-900 border border-slate-800 mr-4 sm:mr-8"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-[10px] font-bold text-white">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="font-semibold text-white">
                      {m.sender?.fullName || (isAdmin ? "Apex Support Officer" : "Student")}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-900 text-teal-300">
                        OFFICIAL
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{formatDateTime(m.createdAt)}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pl-7">
                  {m.message}
                </p>
              </div>
            );
          })}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-300">Post Response / Additional Details</label>
          <textarea
            required
            rows={3}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply message..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
          ></textarea>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !replyMessage.trim()}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20"
            >
              {loading ? <span>Sending...</span> : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
