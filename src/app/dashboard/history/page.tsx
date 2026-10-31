import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/utils";
import { History, BookOpen, BrainCircuit, Bookmark, CheckCircle2, ArrowRight } from "lucide-react";

export default async function LearningHistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Completed articles
  const completedArticles = await prisma.articleProgress.findMany({
    where: { userId: user.id, isCompleted: true },
    include: {
      article: {
        include: { module: { include: { course: true } } },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  // Game attempts
  const gameAttempts = await prisma.gameAttempt.findMany({
    where: { userId: user.id },
    include: { game: true },
    orderBy: { completedAt: "desc" },
  });

  // Bookmarks
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      article: {
        include: { module: { include: { course: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Learning History & Bookmarks</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review your completed curriculum articles, simulation test attempts, and saved reference studies.
        </p>
      </div>

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <div className="finance-card p-6 space-y-4 border-teal-800/60">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Bookmark className="w-4 h-4 fill-teal-400" />
            <span>Saved Reference Articles ({bookmarks.length})</span>
          </div>

          <div className="divide-y divide-slate-800">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-teal-400 uppercase font-semibold">
                    {bm.article.module?.course?.title || "Curriculum"}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{bm.article.title}</h4>
                </div>

                <Link
                  href={`/dashboard/courses/${bm.article.module?.course?.slug || "institutional-price-action"}/${bm.article.slug}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Articles Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <h3 className="text-base font-bold text-white">Completed Articles ({completedArticles.length})</h3>
          </div>
        </div>

        {completedArticles.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No completed articles yet. Mark articles completed as you progress through the curriculum.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Article Title</th>
                  <th className="py-2.5 px-3 font-semibold">Course</th>
                  <th className="py-2.5 px-3 font-semibold">Read Time</th>
                  <th className="py-2.5 px-3 font-semibold">Completed Date</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {completedArticles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-semibold text-white">{item.article.title}</td>
                    <td className="py-2.5 px-3 text-slate-400">{item.article.module?.course?.title}</td>
                    <td className="py-2.5 px-3 text-slate-400">{item.article.readingTimeMinutes} min</td>
                    <td className="py-2.5 px-3 text-slate-400">{item.completedAt ? formatDate(item.completedAt) : "Completed"}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/dashboard/courses/${item.article.module?.course?.slug || "institutional-price-action"}/${item.article.slug}`}
                        className="text-xs text-teal-400 hover:underline font-semibold"
                      >
                        Re-read
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Game Attempts Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Interactive Simulator Attempts ({gameAttempts.length})</h3>
        </div>

        {gameAttempts.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No interactive challenge attempts recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Challenge Name</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Score</th>
                  <th className="py-2.5 px-3 font-semibold">Result</th>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {gameAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-semibold text-white">{att.game.title}</td>
                    <td className="py-2.5 px-3 text-slate-400">{att.game.type}</td>
                    <td className="py-2.5 px-3 font-bold text-teal-400">{att.score} / {att.maxScore}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          att.passed
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {att.passed ? "PASSED" : "FAILED"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{formatDateTime(att.completedAt)}</td>
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
