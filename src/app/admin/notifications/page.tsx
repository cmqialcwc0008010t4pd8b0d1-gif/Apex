import prisma from "@/lib/prisma";
import AdminNotificationsClient from "./AdminNotificationsClient";

export default async function AdminNotificationsPage() {
  const recentNotifications = await prisma.notification.findMany({
    include: {
      user: { select: { fullName: true, uniqueUserId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return <AdminNotificationsClient recentNotifications={recentNotifications} />;
}
