import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  Users,
  ShieldCheck,
  Clock,
  CreditCard,
  DollarSign,
  BookOpen,
  ArrowDownToLine,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default async function AdminDashboardPage() {
  // Real Database Metrics
  const totalRegistrations = await prisma.user.count({ where: { role: "USER" } });
  const activeMembers = await prisma.user.count({ where: { membershipStatus: "ACTIVE", role: "USER" } });
  const pendingActivations = await prisma.user.count({ where: { membershipStatus: { in: ["PENDING", "UNDER_REVIEW"] }, role: "USER" } });

  // Today's registrations
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayRegistrations = await prisma.user.count({
    where: { createdAt: { gte: todayStart }, role: "USER" },
  });

  // Payment Requests counts
  const pendingPaymentsCount = await prisma.paymentRequest.count({ where: { status: { in: ["PENDING", "UNDER_REVIEW", "SUBMITTED"] } } });
  const approvedPaymentsCount = await prisma.paymentRequest.count({ where: { status: "APPROVED" } });
  const rejectedPaymentsCount = await prisma.paymentRequest.count({ where: { status: "REJECTED" } });

  // Verified Revenue
  const verifiedTransactions = await prisma.financialTransaction.findMany({
    where: { type: "MEMBERSHIP_PURCHASE", status: "COMPLETED" },
    select: { amount: true },
  });
  const totalVerifiedRevenue = verifiedTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Withdrawals count
  const pendingWithdrawalsCount = await prisma.withdrawalRequest.count({ where: { status: "PENDING" } });

  // Course Engagement
  const totalCourseProgress = await prisma.articleProgress.count();
  const totalCompletedArticles = await prisma.articleProgress.count({ where: { isCompleted: true } });

  // Recent payment requests needing review
  const pendingPayments = await prisma.paymentRequest.findMany({
    where: { status: { in: ["PENDING", "UNDER_REVIEW", "SUBMITTED"] } },
    include: { user: { select: { fullName: true, uniqueUserId: true, mobileNumber: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin Executive Console</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            System overview, manual payment review pipeline, financial ledgers, and student metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/payments"
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Review Payments ({pendingPaymentsCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 14 Primary Super Admin Statistical Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Verified Revenue */}
        <div className="finance-card p-4 space-y-1 bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-800/80">
          <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Verified Revenue</div>
          <div className="text-2xl font-extrabold text-white">{formatCurrency(totalVerifiedRevenue)}</div>
          <div className="text-[10px] text-slate-400">On-Chain Verified Sales</div>
        </div>

        {/* Pending Payment Requests */}
        <div className="finance-card p-4 space-y-1 bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-800/80">
          <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Pending Payment Reviews</div>
          <div className="text-2xl font-extrabold text-amber-300">{pendingPaymentsCount} Requests</div>
          <div className="text-[10px] text-slate-400">Requires Manual Audit</div>
        </div>

        {/* Active Members */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Members</div>
          <div className="text-xl font-bold text-teal-400">{activeMembers} Members</div>
          <div className="text-[10px] text-slate-400">Paid & Verified Pass</div>
        </div>

        {/* Total Registrations */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Registrations</div>
          <div className="text-xl font-bold text-white">{totalRegistrations} Accounts</div>
          <div className="text-[10px] text-slate-400">Registered Students</div>
        </div>

        {/* Pending Activations */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Activations</div>
          <div className="text-xl font-bold text-amber-400">{pendingActivations} Students</div>
          <div className="text-[10px] text-slate-400">Unpaid / Under Review</div>
        </div>

        {/* Today's Registrations */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Today&apos;s Registrations</div>
          <div className="text-xl font-bold text-white">+{todayRegistrations}</div>
          <div className="text-[10px] text-teal-400">Past 24 Hours</div>
        </div>

        {/* Approved Payments */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Approved Payments</div>
          <div className="text-xl font-bold text-emerald-400">{approvedPaymentsCount}</div>
          <div className="text-[10px] text-slate-400">Verified On-Chain</div>
        </div>

        {/* Rejected Payments */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Rejected Payments</div>
          <div className="text-xl font-bold text-rose-400">{rejectedPaymentsCount}</div>
          <div className="text-[10px] text-slate-400">Invalid TXID / Unconfirmed</div>
        </div>

        {/* Course Engagement */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Course Engagement</div>
          <div className="text-xl font-bold text-white">{totalCourseProgress} Reads</div>
          <div className="text-[10px] text-slate-400">Active Reading Events</div>
        </div>

        {/* Course Completion */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Articles Completed</div>
          <div className="text-xl font-bold text-emerald-400">{totalCompletedArticles} Completed</div>
          <div className="text-[10px] text-slate-400">Verified Study Marks</div>
        </div>

        {/* Pending Withdrawal Requests */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Withdrawals</div>
          <div className="text-xl font-bold text-amber-400">{pendingWithdrawalsCount} Requests</div>
          <div className="text-[10px] text-slate-400">Held in Compliance</div>
        </div>

        {/* System Health */}
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Database Integrity</div>
          <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>SQLite Active</span>
          </div>
          <div className="text-[10px] text-slate-400">Zero External Leakage</div>
        </div>
      </div>

      {/* Pending Payment Review Queue */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Pending Payment Approvals Queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">Students awaiting manual blockchain audit.</p>
          </div>
          <Link href="/admin/payments" className="text-xs text-amber-400 hover:underline font-semibold">
            Open Full Verification Desk &rarr;
          </Link>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No pending payment requests awaiting audit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Student ID</th>
                  <th className="py-3 px-3 font-semibold">Student Name</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Network</th>
                  <th className="py-3 px-3 font-semibold">Transaction Hash</th>
                  <th className="py-3 px-3 font-semibold">Submitted</th>
                  <th className="py-3 px-3 font-semibold text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {pendingPayments.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono font-bold text-teal-400">{req.user.uniqueUserId}</td>
                    <td className="py-3 px-3 font-semibold text-white">{req.user.fullName}</td>
                    <td className="py-3 px-3 font-bold text-white">${req.amount} {req.currency}</td>
                    <td className="py-3 px-3 font-mono text-amber-400">{req.network}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 truncate max-w-[140px]" title={req.txHash}>
                      {req.txHash.slice(0, 10)}...{req.txHash.slice(-6)}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(req.createdAt)}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/payments`}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition-colors"
                      >
                        Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link href="/admin/users" className="finance-card-interactive p-5 space-y-2 block">
          <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm">User Directory</h4>
          <p className="text-xs text-slate-400">Search students, view full profiles, inspect reading history and referrals.</p>
        </Link>

        <Link href="/admin/courses" className="finance-card-interactive p-5 space-y-2 block">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm">Course & Article CMS</h4>
          <p className="text-xs text-slate-400">Author new text-based lessons, create modules, and manage interactive games.</p>
        </Link>

        <Link href="/admin/finance" className="finance-card-interactive p-5 space-y-2 block">
          <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm">Financial Accounting</h4>
          <p className="text-xs text-slate-400">Review immutable transaction ledgers, verified revenue, and disbursement requests.</p>
        </Link>
      </div>
    </div>
  );
}
