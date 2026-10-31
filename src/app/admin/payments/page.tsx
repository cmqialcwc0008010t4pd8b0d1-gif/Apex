import prisma from "@/lib/prisma";
import AdminPaymentsClientView from "./AdminPaymentsClientView";

export default async function AdminPaymentsPage() {
  const paymentRequests = await prisma.paymentRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          uniqueUserId: true,
          fullName: true,
          mobileNumber: true,
          membershipStatus: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const paymentSetting = await prisma.paymentSetting.findFirst();

  return (
    <AdminPaymentsClientView
      paymentRequests={paymentRequests}
      paymentSetting={paymentSetting}
    />
  );
}
