"use client";

import { BarChart3, Download, FileSpreadsheet, Users, CreditCard, BookOpen } from "lucide-react";

export default function AdminReportsClient({
  metrics,
  usersData,
  transactionsData,
}: {
  metrics: any;
  usersData: any[];
  transactionsData: any[];
}) {
  const exportUsersCSV = () => {
    const headers = ["StudentID", "FullName", "MobileNumber", "MembershipStatus", "AccountStatus", "CreatedAt"];
    const rows = usersData.map((u) => [
      u.uniqueUserId,
      `"${u.fullName}"`,
      u.mobileNumber,
      u.membershipStatus,
      u.accountStatus,
      u.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexedge_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportLedgerCSV = () => {
    const headers = ["TxCode", "Type", "Amount", "BalanceAfter", "Status", "CreatedAt"];
    const rows = transactionsData.map((t) => [
      t.transactionCode,
      t.type,
      t.amount,
      t.balanceAfter,
      t.status,
      t.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexedge_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Executive Reports & CSV Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">
          Export verified platform operational ledgers, membership rosters, and curriculum completion reports.
        </p>
      </div>

      {/* CSV Export Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="finance-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Student Registration Roster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export all registered students, permanent unique IDs, normalized mobile numbers, and active membership standings.
            </p>
          </div>

          <button
            onClick={exportUsersCSV}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Students CSV ({usersData.length} Records)</span>
          </button>
        </div>

        <div className="finance-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Accounting Ledger CSV</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export double-entry immutable financial ledger records, transaction codes, and audit balance histories.
            </p>
          </div>

          <button
            onClick={exportLedgerCSV}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Ledger CSV ({transactionsData.length} Records)</span>
          </button>
        </div>
      </div>

      {/* Key Analytical Reports Breakdown */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Platform Operational Metrics Summary</h3>
            <p className="text-xs text-slate-400 mt-0.5">Aggregated performance across students, curriculum, and treasury.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Students</div>
            <div className="text-xl font-bold text-white">{metrics.usersCount}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Members</div>
            <div className="text-xl font-bold text-teal-400">{metrics.activeMembersCount}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Articles Completed</div>
            <div className="text-xl font-bold text-emerald-400">{metrics.completedReads}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Payment Submissions</div>
            <div className="text-xl font-bold text-amber-400">{metrics.paymentRequestsCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
