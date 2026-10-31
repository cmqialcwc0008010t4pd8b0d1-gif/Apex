import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import WithdrawalsClientView from "./WithdrawalsClientView";

export default async function DashboardWithdrawalsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const wallet = await prisma.walletAccount.findUnique({
    where: { userId: user.id },
  });

  const platformSetting = await prisma.platformSetting.findFirst();

  const withdrawalRequests = await prisma.withdrawalRequest.findMany({
    where: { userId: user.id },
    orderBy: { requestedAt: "desc" },
  });

  return (
    <WithdrawalsClientView
      user={user}
      wallet={wallet}
      withdrawalsEnabled={platformSetting?.withdrawalsEnabled || false}
      withdrawalRequests={withdrawalRequests}
    />
  );
}
