"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface CourseActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Mark article as completed or toggle completion
 */
export async function markArticleCompleted(articleId: string): Promise<CourseActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  try {
    const existing = await prisma.articleProgress.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });

    const isNowCompleted = !existing?.isCompleted;

    await prisma.articleProgress.upsert({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
      update: {
        isCompleted: isNowCompleted,
        completedAt: isNowCompleted ? new Date() : null,
        lastReadAt: new Date(),
      },
      create: {
        userId: user.id,
        articleId,
        isCompleted: true,
        completedAt: new Date(),
        lastReadAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/courses");
    revalidatePath("/dashboard/history");

    return {
      success: true,
      data: { isCompleted: isNowCompleted },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update article progress." };
  }
}

/**
 * Toggle bookmark on an article
 */
export async function toggleBookmark(articleId: string): Promise<CourseActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  try {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return { success: true, data: { bookmarked: false } };
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          articleId,
        },
      });
      return { success: true, data: { bookmarked: true } };
    }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle bookmark." };
  }
}

/**
 * Submit interactive educational game attempt
 */
export async function submitGameAttempt(
  gameId: string,
  score: number,
  maxScore: number,
  answersJson: string
): Promise<CourseActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const passed = maxScore > 0 && score / maxScore >= 0.7; // 70% passing grade

  try {
    const attempt = await prisma.gameAttempt.create({
      data: {
        userId: user.id,
        gameId,
        score,
        maxScore,
        passed,
        answersJson,
      },
    });

    // Check if this game is part of today's Daily Learning
    const todayStr = new Date().toISOString().split("T")[0];
    const todayDaily = await prisma.dailyLearning.findFirst({
      where: { date: todayStr, gameId },
    });

    if (todayDaily && passed) {
      await prisma.dailyLearningProgress.upsert({
        where: {
          userId_dailyLearningId: {
            userId: user.id,
            dailyLearningId: todayDaily.id,
          },
        },
        update: { completed: true },
        create: {
          userId: user.id,
          dailyLearningId: todayDaily.id,
          completed: true,
          streakCount: 1,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/daily-learning");
    revalidatePath("/dashboard/history");

    return {
      success: true,
      data: { attemptId: attempt.id, score, maxScore, passed },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to record game attempt." };
  }
}

/**
 * Complete today's daily learning activity
 */
export async function completeDailyLearning(dailyLearningId: string): Promise<CourseActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  try {
    await prisma.dailyLearningProgress.upsert({
      where: {
        userId_dailyLearningId: {
          userId: user.id,
          dailyLearningId,
        },
      },
      update: { completed: true },
      create: {
        userId: user.id,
        dailyLearningId,
        completed: true,
        streakCount: 1,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/daily-learning");

    return { success: true, data: { completed: true } };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to complete daily learning." };
  }
}
