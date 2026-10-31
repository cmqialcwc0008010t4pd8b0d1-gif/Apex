"use client";

import { useState } from "react";
import Link from "next/link";
import { completeDailyLearning } from "@/app/actions/course";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function DailyLearningClient({
  user,
  todayLesson,
  todayProgress,
  completedDaysCount,
  pastLessons,
}: {
  user: any;
  todayLesson: any;
  todayProgress: any;
  completedDaysCount: number;
  pastLessons: any[];
}) {
  const [completed, setCompleted] = useState(todayProgress?.completed || false);
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    if (!todayLesson) return;
    setLoading(true);
    const res = await completeDailyLearning(todayLesson.id);
    setLoading(false);
    if (res.success) {
      setCompleted(true);
    }
  };

  const isMemberActive = user.membershipStatus === "ACTIVE";

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header & Streak Counter Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daily Learning System</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured daily habit formation. Complete daily assignments to cultivate institutional market discipline.
          </p>
        </div>

        {/* Streak Counter Pill */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-800 shrink-0">
          <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold">Active Streak</div>
            <div className="text-base font-bold text-white">{completed ? completedDaysCount + 1 : completedDaysCount} Days</div>
          </div>
        </div>
      </div>

      {/* Today's Focus Card */}
      {todayLesson ? (
        <div className="finance-card p-6 md:p-8 space-y-6 border-teal-800/80 bg-gradient-to-br from-slate-900 to-[#0F172A]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800 uppercase">
                Today&apos;s Curriculum &bull; {todayLesson.date}
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">{todayLesson.title}</h3>
            </div>

            <div>
              {completed ? (
                <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activity Completed</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Pending Completion</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{todayLesson.description}</p>

          {/* Daily Action Items (Article & Game) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todayLesson.article && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold">
                    <BookOpen className="w-4 h-4" />
                    <span>Assigned Article Study</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{todayLesson.article.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{todayLesson.article.summary}</p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/dashboard/courses/${todayLesson.article.module?.course?.slug || "institutional-price-action"}/${todayLesson.article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
                  >
                    <span>Read Assigned Article ({todayLesson.article.readingTimeMinutes} min)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {todayLesson.game && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <BrainCircuit className="w-4 h-4" />
                    <span>Interactive Knowledge Test</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{todayLesson.game.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{todayLesson.game.description}</p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/dashboard/games/${todayLesson.game.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Launch Game Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mark Complete Action Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Completed reading and challenge? Click below to record today&apos;s educational streak.
            </p>

            <button
              onClick={handleMarkComplete}
              disabled={completed || loading}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                completed
                  ? "bg-slate-800 text-slate-400 cursor-default"
                  : "bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/30"
              }`}
            >
              {completed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Streak Recorded for Today</span>
                </>
              ) : loading ? (
                <span>Recording...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Today&apos;s Learning Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="finance-card p-8 text-center text-xs text-slate-400">
          No scheduled daily assignment for today. Browse the complete curriculum under &quot;My Courses&quot;.
        </div>
      )}

      {/* Past Daily Learning Calendar & History */}
      <div className="finance-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Daily Learning Archive</h3>
          <p className="text-xs text-slate-400 mt-0.5">Review previous days&apos; curriculum assignments.</p>
        </div>

        <div className="divide-y divide-slate-800">
          {pastLessons.map((item) => {
            const isItemDone = item.progressEntries && item.progressEntries.length > 0 && item.progressEntries[0].completed;
            return (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-400">({item.date})</span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isItemDone ? (
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                      Uncompleted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
