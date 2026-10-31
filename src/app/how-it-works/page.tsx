import Link from "next/link";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { UserCheck, ShieldCheck, BookOpen, BrainCircuit, Activity, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Register & Secure Your Unique ID",
      icon: UserCheck,
      description: "Sign up using your normalized mobile number. The system immediately assigns your permanent student ID (e.g. EDU100001) and personal referral code.",
    },
    {
      num: "02",
      title: "Activate Your Lifetime Membership",
      icon: ShieldCheck,
      description: "Submit a manual payment request of $20 with your blockchain transaction hash. Our treasury officers audit the transaction on-chain within 2-3 hours.",
    },
    {
      num: "03",
      title: "Study In-Depth Article Curriculums",
      icon: BookOpen,
      description: "Dive into structured, text-based lessons covering institutional order flow, market structure, liquidity sweeps, and mathematical position sizing formulas.",
    },
    {
      num: "04",
      title: "Validate Skills with Interactive Games",
      icon: BrainCircuit,
      description: "Put theory into practice with 8 game formats: Candlestick Pattern Identification, Risk Calculations, Terminology Matching, and Scenario Decisions.",
    },
    {
      num: "05",
      title: "Build Habits with Daily Learning",
      icon: Activity,
      description: "Engage with curated daily assignments to maintain your study streak. Next-day content unlocks as you complete prerequisite exercises.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Educational Path</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">How ApexEdge Works</h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              A systematic, step-by-step framework engineered to develop disciplined market analysts through verified knowledge progression.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="finance-card p-6 flex flex-col sm:flex-row items-start gap-6">
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center shrink-0">
                    <span className="text-2xl font-black text-slate-400">{step.num}</span>
                    <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-6">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-teal-600/30"
            >
              <span>Begin Your Journey Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
