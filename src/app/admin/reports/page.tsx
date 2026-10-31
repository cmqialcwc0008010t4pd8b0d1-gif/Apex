import prisma from "@/lib/prisma";
import AdminReportsClient from "./AdminReportsClient";

export default async function AdminReportsPage() {
  const usersCount = await prisma.user.count({ where: { role: "USER" } });
  const activeMembersCount = await prisma.user.count({ where: { membershipStatus: "ACTIVE" } });
  const totalCourses = await prisma.course.count();
  const totalArticles = await prisma.article.count();
  const completedReads = await prisma.articleProgress.count({ where: { isCompleted: true } });
  const paymentRequestsCount = await prisma.paymentRequest.count();
  const withdrawalRequestsCount = await prisma.withdrawalRequest.count();

  // Load sample export data
  const users = await prisma.user.findMany({
    select: {
      uniqueUserId: true,
      fullName: true,
      mobileNumber: true,
      membershipStatus: true,
      accountStatus: true,
      createdAt: true,
    },
    take: 100,
  });

  const transactions = await prisma.financialTransaction.findMany({
    select: {
      transactionCode: true,
      type: true,
      amount: true,
      balanceAfter: true,
      status: true,
      createdAt: true,
    },
    take: 100,
  });

  return (
    <AdminReportsClient
      metrics={{
        usersCount,
        activeMembersCount,
        totalCourses,
        totalArticles,
        completedReads,
        paymentRequestsCount,
        withdrawalRequestsCount,
      }}
      usersData={users}
      transactionsData={transactions}
    />
  );
}
