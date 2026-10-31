import Link from "next/link";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { BookOpen, BrainCircuit, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        modules: {
          include: {
            articles: {
              where: { isPublished: true },
            },
          },
        },
        games: {
          where: { isPublished: true },
        },
      },
      orderBy: { orderIndex: "asc" },
    });
  } catch (err) {
    console.error("Courses fetch fallback:", err);
    courses = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Curriculum Catalog</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Structured Trading Curriculum</h1>
            <p className="text-slate-400 text-base">
              Explore our comprehensive syllabus covering market structure, liquidity engineering, and mathematical risk management.
            </p>
          </div>

          {/* Courses List */}
          <div className="space-y-8">
            {courses.map((course) => {
              const totalArticles = course.modules.reduce((sum, m) => sum + m.articles.length, 0);
              return (
                <div key={course.id} className="finance-card p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start justify-between">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-400 border border-teal-800">
                        {course.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {course.difficulty} Level
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {course.estimatedHours} Hours Required
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white leading-tight">{course.title}</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>

                    {/* Modules breakdown */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Syllabus Overview:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {course.modules.map((mod) => (
                          <div key={mod.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                            <div className="font-semibold text-white">{mod.title}</div>
                            <div className="text-slate-400">{mod.articles.length} in-depth articles included</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="w-full lg:w-72 shrink-0 p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-5">
                    <div className="space-y-2">
                      <div className="text-xs text-slate-400 font-medium">Full Curriculum Access</div>
                      <div className="text-2xl font-extrabold text-white flex items-baseline gap-1">
                        $20 <span className="text-xs font-normal text-slate-400">Lifetime Platform Pass</span>
                      </div>
                    </div>

                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{totalArticles} In-Depth Articles</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{course.games.length} Interactive Challenge Games</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Reading Progress Tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Daily Practice & Quizzes</span>
                      </li>
                    </ul>

                    <div className="space-y-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>View Syllabus & Articles</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/register"
                        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition-colors flex items-center justify-center"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
