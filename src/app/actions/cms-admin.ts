"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCmsContent(key: string, title: string, content: string) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "COURSE_MANAGER"].includes(user.role)) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    await prisma.cmsContent.upsert({
      where: { key },
      update: { title, content },
      create: { key, title, content },
    });

    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "UPDATE_CMS",
        targetEntity: "CmsContent",
        targetId: key,
        detailsJson: JSON.stringify({ key, title }),
      },
    });

    revalidatePath("/admin/cms");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/terms");
    revalidatePath("/privacy");
    revalidatePath("/refund-policy");
    revalidatePath("/risk-disclosure");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update CMS page." };
  }
}
