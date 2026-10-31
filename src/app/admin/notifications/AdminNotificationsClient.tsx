"use client";

import { useState } from "react";
import { broadcastNotification } from "@/app/actions/admin";
import { formatDateTime } from "@/lib/utils";
import { Bell, Send, CheckCircle2 } from "lucide-react";

export default function AdminNotificationsClient({ recentNotifications }: { recentNotifications: any[] }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("target", target);

    const res = await broadcastNotification(formData);
    setLoading(false);

    if (res.success) {
      setMsg(`Announcement dispatched to ${res.data?.count || 0} students!`);
      setTitle("");
      setMessage("");
    } else {
      setMsg(res.error || "Failed to broadcast notification.");
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Announcements & User Dispatches</h2>
        <p className="text-xs text-slate-400 mt-1">
          Broadcast official platform announcements, curriculum updates, or compliance bulletins.
        </p>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Broadcast Form */}
      <div className="finance-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Compose Student Announcement</h3>

        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Audience</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="ALL">All Registered Students</option>
                <option value="ACTIVE_ONLY">Active Paid Members Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Announcement Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New Liquidity Engineering Article Released"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Message Content *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detailed notification text..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Dispatching..." : "Transmit Announcement"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Dispatches Log */}
      <div className="finance-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Recent System Notifications Log</h3>

        <div className="divide-y divide-slate-800 text-xs">
          {recentNotifications.map((n) => (
            <div key={n.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-semibold text-white">{n.title}</div>
                <div className="text-slate-400">{n.message}</div>
                <div className="text-[10px] text-teal-400">Recipient: {n.user?.fullName} ({n.user?.uniqueUserId})</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">{formatDateTime(n.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
