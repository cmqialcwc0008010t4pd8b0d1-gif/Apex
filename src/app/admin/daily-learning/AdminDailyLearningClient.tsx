"use client";

import { useState } from "react";
import { scheduleDailyLesson } from "@/app/actions/daily-admin";
import { Calendar, Plus, CheckCircle2, BookOpen, BrainCircuit } from "lucide-react";

export default function AdminDailyLearningClient({
  scheduledLessons,
  articles,
  games,
}: {
  scheduledLessons: any[];
  articles: any[];
  games: any[];
}) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [articleId, setArticleId] = useState(articles[0]?.id || "");
  const [gameId, setGameId] = useState(games[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formData = new FormData();
    formData.append("date", date);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("articleId", articleId);
    formData.append("gameId", gameId);

    const res = await scheduleDailyLesson(formData);
    setLoading(false);

    if (res.success) {
      setMsg("Daily lesson published successfully!");
      setShowScheduleForm(false);
      setTitle("");
      setDescription("");
    } else {
      setMsg(res.error || "Failed to schedule lesson.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daily Learning Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Schedule daily focus articles, assign interactive simulators, and track student completion streaks.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleForm(!showScheduleForm)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Daily Lesson</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Schedule Form */}
      {showScheduleForm && (
        <div className="finance-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Configure Daily Assignment</h3>
            <button onClick={() => setShowScheduleForm(false)} className="text-xs text-slate-400 hover:text-white">Close</button>
          </div>

          <form onSubmit={handleSchedule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Schedule Date (YYYY-MM-DD) *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Daily Lesson Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Day 4: Order Flow Imbalances & Fair Value Gaps"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Assign Focus Article</label>
                <select
                  value={articleId}
                  onChange={(e) => setArticleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="">None (Standalone)</option>
                  {articles.map((a) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Assign Interactive Challenge</label>
                <select
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="">None</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Lesson Focus Instructions</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Guidance for students regarding today's learning objectives..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
              >
                {loading ? "Publishing..." : "Publish Scheduled Content"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scheduled Lessons Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Scheduled Lessons Pipeline</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological daily lesson assignments.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{scheduledLessons.length} Scheduled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Scheduled Date</th>
                <th className="py-3 px-3 font-semibold">Lesson Title</th>
                <th className="py-3 px-3 font-semibold">Assigned Article</th>
                <th className="py-3 px-3 font-semibold">Assigned Game</th>
                <th className="py-3 px-3 font-semibold">Completed Students</th>
                <th className="py-3 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {scheduledLessons.map((l) => (
                <tr key={l.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{l.date}</td>
                  <td className="py-3 px-3 font-semibold text-white">{l.title}</td>
                  <td className="py-3 px-3 text-slate-300">{l.article?.title || <span className="text-slate-500 italic">None</span>}</td>
                  <td className="py-3 px-3 text-emerald-400">{l.game?.title || <span className="text-slate-500 italic">None</span>}</td>
                  <td className="py-3 px-3 font-bold text-teal-400">{l._count?.progressEntries || 0}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      PUBLISHED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
