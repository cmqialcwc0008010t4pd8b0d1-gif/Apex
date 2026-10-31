import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ReferralsClientView from "./ReferralsClientView";

export default async function ReferralsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Direct referrals (Level 1)
  const directReferrals = await prisma.user.findMany({
    where: { referredById: user.id },
    select: {
      id: true,
      uniqueUserId: true,
      fullName: true,
      mobileNumber: true,
      membershipStatus: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const commissionSettings = await prisma.commissionSetting.findMany({
    orderBy: { level: "asc" },
  });

  return (
    <ReferralsClientView
      user={user}
      directReferrals={directReferrals}
      commissionSettings={commissionSettings}
    />
  );
}
