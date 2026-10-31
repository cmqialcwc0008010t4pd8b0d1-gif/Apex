import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import MembershipClientView from "./MembershipClientView";

export default async function DashboardMembershipPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const paymentSetting = await prisma.paymentSetting.findFirst();
  const paymentRequests = await prisma.paymentRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <MembershipClientView
      user={user}
      paymentSetting={paymentSetting}
      paymentRequests={paymentRequests}
    />
  );
}
