import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Users,
  Network,
  TrendingUp,
  Award,
  Wallet,
  Clock,
  ArrowRight,
  Sparkles,
  Flame,
  Calendar,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Real Database Queries
  const totalCourses = await prisma.course.count({ where: { isPublished: true } });
  
  const completedArticlesCount = await prisma.articleProgress.count({
    where: { userId: user.id, isCompleted: true },
  });

  const totalArticles = await prisma.article.count({ where: { isPublished: true } });
  const learningProgressPercent = totalArticles > 0 ? Math.round((completedArticlesCount / totalArticles) * 100) : 0;

  // Direct referrals
  const directReferralsCount = await prisma.user.count({
    where: { referredById: user.id },
  });

  // Level 2 team count for network depth calculation
  const directReferrals = await prisma.user.findMany({
    where: { referredById: user.id },
    select: { id: true },
  });
  const directIds = directReferrals.map((d) => d.id);
  const level2Count = await prisma.user.count({
    where: { referredById: { in: directIds } },
  });
  const totalTeamMembers = directReferralsCount + level2Count;

  // Daily learning for today
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLesson = await prisma.dailyLearning.findUnique({
    where: { date: todayStr },
    include: { article: true, game: true },
  });

  const todayCompleted = await prisma.dailyLearningProgress.findUnique({
    where: {
      userId_dailyLearningId: {
        userId: user.id,
        dailyLearningId: todayLesson?.id || "none",
      },
    },
  });

  // Recent transactions
  const recentTransactions = await prisma.financialTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const isPending = user.membershipStatus !== "ACTIVE";

  return (
    <div className="space-y-8">
      {/* Pending Membership Activation Alert Callout */}
      {isPending && (
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-800/80 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-900/60 border border-amber-700/80 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Membership Status: Pending Activation</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Your account is currently inactive. Activate your lifetime membership for $20 USDT to gain unrestricted access to all text articles, interactive candlestick engines, and streak progression.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/membership"
            className="shrink-0 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Activate Membership Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Header Welcome & Quick Identity Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Welcome, {user.fullName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered on {formatDate(user.createdAt)} &bull; Referral Code: <strong className="text-teal-400 font-mono">{user.referralCode}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Student ID: </span>
            <span className="text-teal-400 font-bold font-mono">{user.uniqueUserId}</span>
          </div>
        </div>
      </div>

      {/* 11 Primary Dashboard Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 1. Unique ID */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Student ID</div>
          <div className="text-lg font-bold text-teal-400 font-mono truncate">{user.uniqueUserId}</div>
          <div className="text-[10px] text-slate-400">Permanent Record</div>
        </div>

        {/* 2. Membership Status */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Membership</div>
          <div className="text-lg font-bold text-white flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${user.membershipStatus === "ACTIVE" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            <span>{user.membershipStatus}</span>
          </div>
          <div className="text-[10px] text-slate-400">$20 Lifetime Pass</div>
        </div>

        {/* 3. Learning Progress */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Learning Progress</div>
          <div className="text-lg font-bold text-emerald-400">{learningProgressPercent}%</div>
          <div className="text-[10px] text-slate-400">{completedArticlesCount} of {totalArticles} Articles</div>
        </div>

        {/* 4. Available Courses */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Courses Available</div>
          <div className="text-lg font-bold text-white">{totalCourses} Tracks</div>
          <div className="text-[10px] text-slate-400">Institutional Syllabus</div>
        </div>

        {/* 5. Direct Referrals */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Direct Referrals</div>
          <div className="text-lg font-bold text-teal-400">{directReferralsCount} Students</div>
          <div className="text-[10px] text-slate-400">1st Degree Network</div>
        </div>

        {/* 6. Total Team Members */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Team</div>
          <div className="text-lg font-bold text-white">{totalTeamMembers} Members</div>
          <div className="text-[10px] text-slate-400">Multi-tier Network</div>
        </div>

        {/* 7. Referral Earnings */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Referral Earnings</div>
          <div className="text-lg font-bold text-white">{formatCurrency(user.walletAccount?.totalEarned || 0)}</div>
          <div className="text-[10px] text-amber-400/80">Compliance Held</div>
        </div>

        {/* 8. Bonus Earnings */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Bonus Earnings</div>
          <div className="text-lg font-bold text-white">{formatCurrency(0)}</div>
          <div className="text-[10px] text-slate-400">Weekly Achievement</div>
        </div>

        {/* 9. Wallet Balance */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Wallet Balance</div>
          <div className="text-lg font-bold text-emerald-400">{formatCurrency(user.walletAccount?.balance || 0)}</div>
          <div className="text-[10px] text-slate-400">Verified Available</div>
        </div>

        {/* 10. Pending Withdrawals */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Pending Withdrawals</div>
          <div className="text-lg font-bold text-white">{formatCurrency(user.walletAccount?.pendingWithdrawals || 0)}</div>
          <div className="text-[10px] text-slate-400">Processing Queue</div>
        </div>

        {/* 11. Registration Date */}
        <div className="finance-card p-4 space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Enrolled Since</div>
          <div className="text-base font-bold text-white">{formatDate(user.createdAt)}</div>
          <div className="text-[10px] text-teal-400">Active Record</div>
        </div>
      </div>

      {/* Today's Daily Learning Assignment */}
      <div className="finance-card p-6 border-teal-800/60 bg-gradient-to-r from-slate-900 to-[#0F172A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 shrink-0">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">Daily Discipline Protocol</div>
              <h3 className="text-lg font-bold text-white">{todayLesson?.title || "Daily Educational Assignment"}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {todayCompleted ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed Today</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Completion</span>
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {todayLesson?.description || "Engage with today's market study and complete the knowledge challenge to preserve your daily learning streak."}
          </p>

          <Link
            href="/dashboard/daily-learning"
            className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Open Today&apos;s Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="finance-card p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm">Resume Learning</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Access your course catalog, review marked bookmarks, and track completed reading progress.
          </p>
          <div className="pt-1">
            <Link href="/dashboard/courses" className="text-xs font-semibold text-teal-400 hover:underline">
              Go to Courses &rarr;
            </Link>
          </div>
        </div>

        <div className="finance-card p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm">Referral Network</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Share your unique referral link to build your team across 10 levels with full visualization.
          </p>
          <div className="pt-1">
            <Link href="/dashboard/referrals" className="text-xs font-semibold text-teal-400 hover:underline">
              View Referral Tree &rarr;
            </Link>
          </div>
        </div>

        <div className="finance-card p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm">Financial Ledger</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Immutable transaction records, verified ledger entries, and manual payout verification status.
          </p>
          <div className="pt-1">
            <Link href="/dashboard/wallet" className="text-xs font-semibold text-teal-400 hover:underline">
              View Wallet &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
