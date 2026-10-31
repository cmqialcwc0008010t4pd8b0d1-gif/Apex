import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { HelpCircle, ArrowRight } from "lucide-react";

export default async function AdminSupportPage() {
  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: {
        select: { uniqueUserId: true, fullName: true, mobileNumber: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Support Ticket Management Queue</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review student inquiries, answer questions, and resolve payment or account issues.
        </p>
      </div>

      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">All Support Tickets</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing {tickets.length} total student inquiries.</p>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No support tickets in queue.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {tickets.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{t.ticketNumber}</span>
                    <span className="text-xs font-semibold text-white">{t.subject}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Student: <strong className="text-white">{t.user.fullName}</strong> ({t.user.uniqueUserId}) &bull; Mobile: {t.user.mobileNumber} &bull; Category: {t.category}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      t.status === "RESOLVED" || t.status === "CLOSED"
                        ? "bg-slate-800 text-slate-400 border border-slate-700"
                        : t.status === "IN_PROGRESS"
                        ? "bg-teal-950 text-teal-400 border border-teal-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {t.status}
                  </span>

                  <Link
                    href={`/dashboard/support/${t.id}`}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Respond</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
