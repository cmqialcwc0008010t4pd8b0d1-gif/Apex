import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BookOpen, CheckCircle2, Circle, Clock, ChevronRight, BrainCircuit, ArrowLeft, ArrowRight } from "lucide-react";

export default async function DashboardCourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          articles: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
      games: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!course) notFound();

  // Fetch student progress
  const userProgress = await prisma.articleProgress.findMany({
    where: { userId: user.id },
  });
  const completedMap = new Map(userProgress.map((p) => [p.articleId, p.isCompleted]));

  return (
    <div className="max-w-4xl space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/dashboard/courses" className="hover:text-teal-400 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Curriculum</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 truncate">{course.title}</span>
      </div>

      {/* Header */}
      <div className="finance-card p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800 uppercase">
            {course.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {course.estimatedHours} Hours Required
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {course.title}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">{course.description}</p>
      </div>

      {/* Modules & Articles List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Course Syllabus & Text Articles</h2>
          <span className="text-xs text-slate-400">{course.modules.length} Modules</span>
        </div>

        {course.modules.map((mod, mIdx) => (
          <div key={mod.id} className="finance-card overflow-hidden">
            <div className="p-4 bg-slate-900/80 border-b border-slate-800">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Module {mIdx + 1}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{mod.title}</h3>
              {mod.description && <p className="text-xs text-slate-400 mt-1">{mod.description}</p>}
            </div>

            <div className="divide-y divide-slate-800">
              {mod.articles.map((article, aIdx) => {
                const isCompleted = completedMap.get(article.id) || false;
                return (
                  <Link
                    key={article.id}
                    href={`/dashboard/courses/${course.slug}/${article.slug}`}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 group-hover:text-teal-400 shrink-0 transition-colors" />
                      )}

                      <div className="space-y-0.5">
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>Article {mIdx + 1}.{aIdx + 1}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readingTimeMinutes} min read
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                          {article.title}
                        </h4>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-teal-400">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Challenges */}
      {course.games.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Interactive Knowledge Challenges</h2>
            <span className="text-xs text-slate-400">{course.games.length} Interactive Simulators</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.games.map((game) => (
              <div key={game.id} className="finance-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                    {game.type}
                  </span>
                  <h4 className="text-base font-bold text-white">{game.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{game.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <Link
                    href={`/dashboard/games/${game.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span>Launch Challenge Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
