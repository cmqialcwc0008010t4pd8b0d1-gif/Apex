"use client";

import { useState } from "react";
import { updateCmsContent } from "@/app/actions/cms-admin";
import { Globe, Save, CheckCircle2 } from "lucide-react";

export default function AdminCmsClient({ cmsEntries }: { cmsEntries: any[] }) {
  const [selectedKey, setSelectedKey] = useState(cmsEntries[0]?.key || "about_us");
  const [entries, setEntries] = useState(cmsEntries);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const activeEntry = entries.find((e) => e.key === selectedKey);

  const handleFieldChange = (field: string, val: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.key === selectedKey ? { ...e, [field]: val } : e))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEntry) return;

    setLoading(true);
    setMsg(null);
    const res = await updateCmsContent(activeEntry.key, activeEntry.title, activeEntry.content);
    setLoading(false);

    if (res.success) {
      setMsg(`Page "${activeEntry.title}" updated successfully!`);
      setTimeout(() => setMsg(null), 2500);
    } else {
      setMsg(res.error || "Failed to update page.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Website Content Management System (CMS)</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage public website pages, terms of service, privacy disclosures, and about us copy.
        </p>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Page Selector Sidebar */}
        <div className="finance-card p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Select CMS Page
          </div>
          {entries.map((entry) => (
            <button
              key={entry.key}
              onClick={() => setSelectedKey(entry.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors truncate ${
                selectedKey === entry.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {entry.title || entry.key}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="md:col-span-3 finance-card p-6 space-y-4">
          {activeEntry ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Editing: {activeEntry.title}</h3>
                <span className="font-mono text-xs text-amber-400">{activeEntry.key}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Page Headline / Title</label>
                <input
                  type="text"
                  required
                  value={activeEntry.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Page Body Content (Markdown Supported)</label>
                <textarea
                  rows={14}
                  required
                  value={activeEntry.content}
                  onChange={(e) => handleFieldChange("content", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-teal-500 leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? "Publishing Changes..." : "Save Page Content"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">Select a page to edit content.</div>
          )}
        </div>
      </div>
    </div>
  );
}
