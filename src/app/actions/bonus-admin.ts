"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateBonusSlab(
  slabId: string,
  minDirect: number,
  minTeam: number,
  amount: number,
  deductionPct: number,
  isActive: boolean
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized: Super Admin permissions required." };
  }

  try {
    await prisma.bonusSetting.update({
      where: { id: slabId },
      data: {
        minDirectReferrals: minDirect,
        minTeamSize: minTeam,
        bonusAmount: amount,
        maintenanceDeductionPct: deductionPct,
        isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "UPDATE_BONUS_SLAB",
        targetEntity: "BonusSetting",
        targetId: slabId,
        detailsJson: JSON.stringify({ minDirect, minTeam, amount, deductionPct, isActive }),
      },
    });

    revalidatePath("/admin/bonus");
    revalidatePath("/dashboard/bonus");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update bonus slab." };
  }
}
