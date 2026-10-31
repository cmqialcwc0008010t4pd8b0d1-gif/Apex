import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Bell, ShieldCheck, CreditCard, BookOpen } from "lucide-react";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System & Account Notifications</h2>
        <p className="text-xs text-slate-400 mt-1">
          Direct dispatches regarding manual payment approvals, course updates, and system announcements.
        </p>
      </div>

      <div className="finance-card p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No notifications logged at this time.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {notifications.map((n) => (
              <div key={n.id} className="py-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{formatDateTime(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
