import Link from "next/link";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { ShieldCheck, BookOpen, BrainCircuit, Activity, CheckCircle, ArrowRight, Layers, Lock, Award, Users } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real course data from SQLite
  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        modules: {
          include: {
            articles: true,
          },
        },
        games: true,
      },
      take: 3,
    });
  } catch (err) {
    console.error("Home courses fallback:", err);
    courses = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,118,110,0.15),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Independent Institutional Curriculum</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Master Institutional Trading with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Structured Knowledge</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              A comprehensive, article-based educational platform designed for serious traders. Deconstruct market microstructure, master order flow dynamics, and calculate quantitative risk with interactive simulations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Enroll Now &bull; $20 Membership</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Browse Curriculum</span>
              </Link>
            </div>

            {/* Platform Credibility Highlights */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-slate-800/80 mt-12">
              <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-1">Article-Based In-Depth Theory</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
                <div className="text-2xl font-bold text-teal-400">8 Modules</div>
                <div className="text-xs text-slate-400 mt-1">Interactive Simulation Challenges</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
                <div className="text-2xl font-bold text-white">Daily</div>
                <div className="text-xs text-slate-400 mt-1">Structured Habit-Building Lessons</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
                <div className="text-2xl font-bold text-emerald-400">Manual</div>
                <div className="text-xs text-slate-400 mt-1">Audited Compliance Verification</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Educational Courses */}
      <section className="py-20 bg-[#070D19]/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">Core Educational Tracks</div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Structured Learning Tracks</h2>
              <p className="text-slate-400 mt-2 max-w-xl text-sm">
                Each course consists of rigorous written studies, mathematical models, and interactive scenario games to validate your comprehension.
              </p>
            </div>
            <Link
              href="/courses"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => {
              const totalArticles = course.modules?.reduce((sum: number, m: any) => sum + (m.articles?.length || 0), 0) || 0;
              return (
                <div key={course.id} className="finance-card-interactive p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-teal-950 text-teal-400 border border-teal-800">
                        {course.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{course.estimatedHours} Hours Estimated</span>
                    </div>

                    <h3 className="text-xl font-bold text-white leading-snug">{course.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{course.summary}</p>

                    <div className="pt-2 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-teal-400" />
                        <span>{totalArticles} In-Depth Articles</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4 text-emerald-400" />
                        <span>{course.games.length} Interactive Games</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Explore Syllabus</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Article-Based Learning Works */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Methodology</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Engineered for Retention, Not Entertainment</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Video courses encourage passive watching. ApexEdge utilizes structured text, mathematical reference tables, and active decision quizzes so concepts become permanent intuition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="finance-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Deep Written Formulation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Clear diagrams, callout boxes for common pitfalls, step-by-step mathematical proofs, and precise institutional terminology.
              </p>
            </div>

            <div className="finance-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Interactive Decision Engines</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                8 distinct educational game models: Candlestick Pattern Identification, Risk Calculations, and Terminology Matching.
              </p>
            </div>

            <div className="finance-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Daily Learning Routine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Build disciplined trading habits with daily bite-sized lesson assignments, streak tracking, and knowledge verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Membership Callout */}
      <section className="py-20 bg-gradient-to-b from-[#0F172A] to-[#0B1120] border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
            Clear, Predictable Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Lifetime Access For Just <span className="text-teal-400">$20 One-Time</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            No recurring monthly charges. No hidden up-sells. Manual blockchain payment verification with transparent review windows guarantees legitimate student enrollment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/30 transition-all"
            >
              Register & Request Activation
            </Link>
            <Link
              href="/membership"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Read Payment & Verification Steps
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
