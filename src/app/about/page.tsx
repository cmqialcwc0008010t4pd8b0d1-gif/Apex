import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { ShieldCheck, Target, CheckCircle2, Award, BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let cmsAbout: any = null;
  try {
    cmsAbout = await prisma.cmsContent.findUnique({
      where: { key: "about_us" },
    });
  } catch (err) {
    console.error("About CMS fallback:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Independent Educational Platform</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">About ApexEdge Trading Academy</h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Empowering self-directed analysts with institutional market mechanics and mathematical risk management.
            </p>
          </div>

          {/* Content Card */}
          <div className="finance-card p-8 md:p-10 space-y-8">
            <div className="space-y-4 text-slate-300 leading-relaxed text-base">
              {cmsAbout?.content ? (
                cmsAbout.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p>ApexEdge Trading Academy is committed to delivering honest, disciplined, and rigorous financial education.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-sm">Truth Over Hype</h3>
                <p className="text-xs text-slate-400">
                  We state clearly that trading involves extreme risk. We never promote get-rich-quick fantasies or automated shortcuts.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-sm">Deep Written Analysis</h3>
                <p className="text-xs text-slate-400">
                  Structured article format designed for retention, precision, and quick reference during market analysis sessions.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-sm">Verified Decision-Making</h3>
                <p className="text-xs text-slate-400">
                  Every concept is accompanied by scenario-based quizzes and candlestick challenges to ensure active learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
