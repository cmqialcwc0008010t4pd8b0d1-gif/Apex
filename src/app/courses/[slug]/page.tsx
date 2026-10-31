import Link from "next/link";
import { notFound } from "next/navigation";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { BookOpen, BrainCircuit, Clock, ArrowRight, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  let course: any = null;
  try {
    course = await prisma.course.findUnique({
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
  } catch (err) {
    console.error("Course detail fetch fallback:", err);
  }

  if (!course) {
    notFound();
  }

  const isMemberActive = user?.membershipStatus === "ACTIVE";

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/courses" className="hover:text-teal-400">Curriculum</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200 truncate">{course.title}</span>
          </div>

          {/* Header */}
          <div className="finance-card p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-400 border border-teal-800">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {course.difficulty} Level
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {course.estimatedHours} Hours Estimated
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">{course.description}</p>
          </div>

          {/* Curriculum Syllabus & Articles */}
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white">Course Modules & Articles</h2>
              <p className="text-xs text-slate-400 mt-1">Text-based institutional studies with detailed terminology.</p>
            </div>

            {course.modules.map((module, mIdx) => (
              <div key={module.id} className="finance-card overflow-hidden">
                <div className="p-5 bg-slate-900/80 border-b border-slate-800">
                  <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Module {mIdx + 1}</div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{module.title}</h3>
                  {module.description && (
                    <p className="text-xs text-slate-400 mt-1">{module.description}</p>
                  )}
                </div>

                <div className="divide-y divide-slate-800">
                  {module.articles.map((article, aIdx) => (
                    <div key={article.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">Article {mIdx + 1}.{aIdx + 1}</span>
                          <span className="text-[11px] text-slate-400">&bull; {article.readingTimeMinutes} min read</span>
                        </div>
                        <h4 className="text-base font-semibold text-white">{article.title}</h4>
                        <p className="text-xs text-slate-400 max-w-2xl">{article.summary}</p>
                      </div>

                      {isMemberActive ? (
                        <Link
                          href={`/dashboard/courses/${course.slug}/${article.slug}`}
                          className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read Article</span>
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="shrink-0 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-slate-700"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Sign In to Read</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Games in this Course */}
          {course.games.length > 0 && (
            <div className="space-y-4 pt-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white">Interactive Educational Challenges</h2>
                <p className="text-xs text-slate-400 mt-1">Hands-on knowledge tests to reinforce market pattern identification and risk calculations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.games.map((game) => (
                  <div key={game.id} className="finance-card p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {game.type}
                      </span>
                      <h4 className="font-bold text-white text-base">{game.title}</h4>
                      <p className="text-xs text-slate-400">{game.description}</p>
                    </div>

                    <div className="pt-2">
                      {isMemberActive ? (
                        <Link
                          href={`/dashboard/games/${game.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
                        >
                          <BrainCircuit className="w-4 h-4" />
                          <span>Play Challenge</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-300"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Member Only Challenge</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
