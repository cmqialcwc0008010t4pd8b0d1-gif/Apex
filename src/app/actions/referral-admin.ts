"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCommissionSetting(level: number, percentage: number, isActive: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized: Super Admin permissions required." };
  }

  try {
    await prisma.commissionSetting.upsert({
      where: { level },
      update: { percentage, isActive },
      create: { level, percentage, isActive },
    });

    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "UPDATE_COMMISSION_TIER",
        targetEntity: "CommissionSetting",
        detailsJson: JSON.stringify({ level, percentage, isActive }),
      },
    });

    revalidatePath("/admin/referrals");
    revalidatePath("/referral-program");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update commission setting." };
  }
}
