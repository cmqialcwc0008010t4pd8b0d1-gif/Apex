"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function scheduleDailyLesson(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "COURSE_MANAGER"].includes(user.role)) {
    return { success: false, error: "Unauthorized." };
  }

  const date = formData.get("date") as string; // YYYY-MM-DD
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const articleId = formData.get("articleId") as string;
  const gameId = formData.get("gameId") as string;

  if (!date || !title) {
    return { success: false, error: "Date and title are required." };
  }

  try {
    const lesson = await prisma.dailyLearning.upsert({
      where: { date },
      update: {
        title,
        description: description || title,
        articleId: articleId || null,
        gameId: gameId || null,
        isPublished: true,
      },
      create: {
        date,
        title,
        description: description || title,
        articleId: articleId || null,
        gameId: gameId || null,
        isPublished: true,
      },
    });

    revalidatePath("/admin/daily-learning");
    revalidatePath("/dashboard/daily-learning");
    revalidatePath("/dashboard");

    return { success: true, data: lesson };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to schedule daily learning." };
  }
}
