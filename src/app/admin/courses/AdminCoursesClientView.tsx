"use client";

import { useState } from "react";
import { createCourse, createModule, createArticle } from "@/app/actions/course-admin";
import { BookOpen, Plus, FileText, FolderPlus, CheckCircle2, ChevronRight, Layers } from "lucide-react";

export default function AdminCoursesClientView({ courses }: { courses: any[] }) {
  const [activeTab, setActiveTab] = useState<"LIST" | "NEW_COURSE" | "NEW_MODULE" | "NEW_ARTICLE">("LIST");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Form states
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [selectedModuleId, setSelectedModuleId] = useState(courses[0]?.modules[0]?.id || "");

  async function handleCreateCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await createCourse(formData);
    setLoading(false);
    if (res.success) {
      setMsg("Course created successfully!");
      setActiveTab("LIST");
    } else {
      setMsg(res.error || "Failed to create course.");
    }
  }

  async function handleCreateModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await createModule(formData);
    setLoading(false);
    if (res.success) {
      setMsg("Module created successfully!");
      setActiveTab("LIST");
    } else {
      setMsg(res.error || "Failed to create module.");
    }
  }

  async function handleCreateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await createArticle(formData);
    setLoading(false);
    if (res.success) {
      setMsg("Article created successfully!");
      setActiveTab("LIST");
    } else {
      setMsg(res.error || "Failed to create article.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Curriculum & Article CMS</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage course tracks, syllabus modules, text-based articles, and educational illustrations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("NEW_COURSE")}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Course</span>
          </button>
          <button
            onClick={() => setActiveTab("NEW_MODULE")}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Module</span>
          </button>
          <button
            onClick={() => setActiveTab("NEW_ARTICLE")}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* New Course Form */}
      {activeTab === "NEW_COURSE" && (
        <div className="finance-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Create New Course Track</h3>
            <button onClick={() => setActiveTab("LIST")} className="text-xs text-slate-400 hover:text-white">Back to List</button>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Advanced Order Flow & Footprint Dynamics"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">URL Slug *</label>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="e.g. advanced-order-flow-dynamics"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <input
                  type="text"
                  name="category"
                  defaultValue="Price Action"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Difficulty</label>
                <select
                  name="difficulty"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Summary (Short Tagline)</label>
              <input
                type="text"
                name="summary"
                required
                placeholder="High-level syllabus overview..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Detailed Description</label>
              <textarea
                name="description"
                rows={3}
                required
                placeholder="Comprehensive syllabus scope..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setActiveTab("LIST")} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white">
                {loading ? "Publishing..." : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Module Form */}
      {activeTab === "NEW_MODULE" && (
        <div className="finance-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Create New Course Module</h3>
            <button onClick={() => setActiveTab("LIST")} className="text-xs text-slate-400 hover:text-white">Back to List</button>
          </div>

          <form onSubmit={handleCreateModule} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Assign to Course *</label>
              <select
                name="courseId"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Module Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Module 3: Imbalance & Fair Value Mechanics"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Module Scope / Description</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Key concepts covered in this module..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setActiveTab("LIST")} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white">
                {loading ? "Adding Module..." : "Add Module"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Article Form */}
      {activeTab === "NEW_ARTICLE" && (
        <div className="finance-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Author New Text-Based Educational Article</h3>
            <button onClick={() => setActiveTab("LIST")} className="text-xs text-slate-400 hover:text-white">Back to List</button>
          </div>

          <form onSubmit={handleCreateArticle} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Parent Module *</label>
                <select
                  name="moduleId"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {courses.flatMap((c) =>
                    c.modules.map((m: any) => (
                      <option key={m.id} value={m.id}>{c.title} &rarr; {m.title}</option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Estimated Reading Time (Minutes)</label>
                <input
                  type="number"
                  name="readingTimeMinutes"
                  defaultValue={8}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Article Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Engineering Liquidity Around Key Support"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">URL Slug *</label>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="e.g. engineering-liquidity-around-key-support"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Summary / Abstract</label>
              <input
                type="text"
                name="summary"
                placeholder="Brief 1-2 sentence core insight..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Executive Key Takeaways (Markdown / Bullets)</label>
              <textarea
                name="keyTakeaways"
                rows={2}
                placeholder="1. Stop sweeps precede real expansion.&#10;2. Never buy into premium order blocks."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Full Article Content (Markdown format with ## Headings, Tables, &gt; Callouts, Examples) *
              </label>
              <textarea
                name="content"
                rows={8}
                required
                placeholder="## 1. Institutional Market Mechanics&#10;&#10;Price action represents an continuous auction between buyers and sellers...&#10;&#10;> **Important Note:** Invalidation occurs when the 4H body closes outside the zone."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setActiveTab("LIST")} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white">
                {loading ? "Publishing Article..." : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses & Articles Tree Overview */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="finance-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800 uppercase">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{course.difficulty}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{course.title}</h3>
              </div>

              <div className="text-right text-xs text-slate-400">
                <div>{course.modules.length} Modules</div>
                <div>{course.modules.reduce((s: number, m: any) => s + m.articles.length, 0)} Articles</div>
              </div>
            </div>

            {/* Modules and Articles List */}
            <div className="space-y-3">
              {course.modules.map((m: any, mIdx: number) => (
                <div key={m.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Module {mIdx + 1}: {m.title}</span>
                    <span className="text-slate-400 font-normal">{m.articles.length} Articles</span>
                  </div>

                  <div className="divide-y divide-slate-800/80 pt-1">
                    {m.articles.map((art: any, aIdx: number) => (
                      <div key={art.id} className="py-2 flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{mIdx + 1}.{aIdx + 1}</span>
                          <span>{art.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({art.slug})</span>
                        </div>
                        <span className="text-[10px] text-teal-400 font-medium">{art.readingTimeMinutes} min read</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
