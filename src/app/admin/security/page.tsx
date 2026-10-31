import prisma from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, KeyRound, UserCheck, Lock } from "lucide-react";

export default async function AdminSecurityPage() {
  const adminUsers = await prisma.user.findMany({
    where: {
      role: { in: ["SUPER_ADMIN", "FINANCE_ADMIN", "COURSE_MANAGER", "SUPPORT_ADMIN", "ANALYST"] },
    },
    orderBy: { createdAt: "asc" },
  });

  const auditLogs = await prisma.auditLog.findMany({
    include: {
      admin: {
        select: { uniqueUserId: true, fullName: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Admin Security, Roles & Immutable Audit Logs</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage privileged administrative roles, review security permissions, and inspect immutable system audit events.
        </p>
      </div>

      {/* Role-Based Access Control Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="finance-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin</span>
          </div>
          <p className="text-xs text-slate-300">Full system access, platform settings, treasury disbursements, and role elevation.</p>
        </div>

        <div className="finance-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase">
            <KeyRound className="w-4 h-4" />
            <span>Finance & Treasury Admin</span>
          </div>
          <p className="text-xs text-slate-300">Payment verification, blockchain audits, withdrawal request processing, and financial ledgers.</p>
        </div>

        <div className="finance-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
            <UserCheck className="w-4 h-4" />
            <span>Course Manager & Support</span>
          </div>
          <p className="text-xs text-slate-300">Article publishing, module creation, quiz configuration, and student ticket assistance.</p>
        </div>
      </div>

      {/* Administrative Accounts Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Privileged Administrative Staff</h3>
            <p className="text-xs text-slate-400 mt-0.5">Authorized accounts with elevated platform roles.</p>
          </div>
          <span className="text-xs font-mono text-amber-400">{adminUsers.length} Admin Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Admin ID</th>
                <th className="py-2.5 px-3 font-semibold">Staff Name</th>
                <th className="py-2.5 px-3 font-semibold">Mobile Identifier</th>
                <th className="py-2.5 px-3 font-semibold">Assigned Role</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {adminUsers.map((a) => (
                <tr key={a.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{a.uniqueUserId}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{a.fullName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{a.mobileNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      {a.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400">
                      {a.accountStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Logs Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Immutable Administrative Audit Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological record of privileged system actions.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} Events</span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No administrative audit events recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Action</th>
                  <th className="py-2.5 px-3 font-semibold">Target Entity</th>
                  <th className="py-2.5 px-3 font-semibold">Executing Officer</th>
                  <th className="py-2.5 px-3 font-semibold">Audit Details</th>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{log.action}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{log.targetEntity}</td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {log.admin?.fullName || "System"} <span className="font-mono text-[10px] text-teal-400">({log.admin?.uniqueUserId || "SYS"})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono max-w-xs truncate" title={log.detailsJson || ""}>
                      {log.detailsJson || "N/A"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
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
