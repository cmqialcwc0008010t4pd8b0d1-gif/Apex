import prisma from "@/lib/prisma";
import AdminReferralsClient from "./AdminReferralsClient";

export default async function AdminReferralsPage() {
  const commissionSettings = await prisma.commissionSetting.findMany({
    orderBy: { level: "asc" },
  });

  const allReferralRelations = await prisma.user.findMany({
    where: { referredById: { not: null } },
    include: {
      referrer: {
        select: { uniqueUserId: true, fullName: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <AdminReferralsClient
      commissionSettings={commissionSettings}
      referralRelations={allReferralRelations}
    />
  );
}
