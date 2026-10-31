import prisma from "@/lib/prisma";
import AdminFinanceClient from "./AdminFinanceClient";

export default async function AdminFinancePage() {
  const transactions = await prisma.financialTransaction.findMany({
    include: {
      user: {
        select: { uniqueUserId: true, fullName: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const withdrawalRequests = await prisma.withdrawalRequest.findMany({
    include: {
      user: {
        select: { uniqueUserId: true, fullName: true, mobileNumber: true },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  // Calculate totals
  const allTx = await prisma.financialTransaction.findMany({
    select: { type: true, amount: true, status: true },
  });

  const verifiedRevenue = allTx
    .filter((t) => t.type === "MEMBERSHIP_PURCHASE" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = allTx
    .filter((t) => t.type === "WITHDRAWAL" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalRefunds = allTx
    .filter((t) => t.type === "REFUND" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AdminFinanceClient
      transactions={transactions}
      withdrawalRequests={withdrawalRequests}
      verifiedRevenue={verifiedRevenue}
      totalWithdrawn={totalWithdrawn}
      totalRefunds={totalRefunds}
    />
  );
}
