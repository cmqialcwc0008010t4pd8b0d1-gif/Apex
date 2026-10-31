import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BookOpen, BrainCircuit, CheckCircle2, Clock, ArrowRight, Lock } from "lucide-react";

export default async function DashboardCoursesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        include: {
          articles: {
            where: { isPublished: true },
            select: { id: true, title: true, slug: true, readingTimeMinutes: true },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
      games: {
        where: { isPublished: true },
        select: { id: true, title: true, slug: true, type: true },
      },
    },
    orderBy: { orderIndex: "asc" },
  });

  // Get user's completed articles
  const completedProgress = await prisma.articleProgress.findMany({
    where: { userId: user.id, isCompleted: true },
    select: { articleId: true },
  });
  const completedSet = new Set(completedProgress.map((p) => p.articleId));

  const isMemberActive = user.membershipStatus === "ACTIVE";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Institutional Course Curriculum</h2>
        <p className="text-xs text-slate-400 mt-1">
          Structured text-based articles, mathematical formulations, and interactive educational simulations.
        </p>
      </div>

      {!isMemberActive && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              Your membership is currently <strong>Pending Activation</strong>. Activate your $20 pass to access full article reading and interactive quizzes.
            </div>
          </div>
          <Link
            href="/dashboard/membership"
            className="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
          >
            Activate Access
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course) => {
          const allArticles = course.modules.flatMap((m) => m.articles);
          const completedCount = allArticles.filter((a) => completedSet.has(a.id)).length;
          const progressPercent = allArticles.length > 0 ? Math.round((completedCount / allArticles.length) * 100) : 0;

          return (
            <div key={course.id} className="finance-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800 uppercase">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {course.estimatedHours} Hours
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{course.summary}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Progress: {progressPercent}%</span>
                    <span>{completedCount} of {allArticles.length} Articles Completed</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Modules & Games Count */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    <span>{course.modules.length} Modules ({allArticles.length} Articles)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    <span>{course.games.length} Interactive Games</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                {isMemberActive ? (
                  <Link
                    href={`/dashboard/courses/${course.slug}`}
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{completedCount > 0 ? "Continue Course" : "Start Course"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/membership"
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Activate Membership to Unlock</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
