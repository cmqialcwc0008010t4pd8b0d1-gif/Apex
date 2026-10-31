import prisma from "@/lib/prisma";
import AdminBonusClient from "./AdminBonusClient";

export default async function AdminBonusPage() {
  const bonusSlabs = await prisma.bonusSetting.findMany({
    orderBy: { bonusAmount: "asc" },
  });

  const bonusRecords = await prisma.bonusRecord.findMany({
    include: {
      user: {
        select: { uniqueUserId: true, fullName: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <AdminBonusClient
      bonusSlabs={bonusSlabs}
      bonusRecords={bonusRecords}
    />
  );
}
