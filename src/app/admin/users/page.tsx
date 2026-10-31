import prisma from "@/lib/prisma";
import AdminUsersClientView from "./AdminUsersClientView";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      membership: true,
      walletAccount: true,
      referrer: {
        select: { uniqueUserId: true, fullName: true },
      },
      _count: {
        select: {
          directReferrals: true,
          articleProgress: true,
          gameAttempts: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminUsersClientView users={users} />;
}
