"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface CourseAdminResult {
  success: boolean;
  error?: string;
  data?: any;
}

async function ensureAdmin() {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "COURSE_MANAGER"].includes(user.role)) {
    throw new Error("Unauthorized: Course management rights required.");
  }
  return user;
}

export async function createCourse(formData: FormData): Promise<CourseAdminResult> {
  try {
    const admin = await ensureAdmin();
    const title = (formData.get("title") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim()?.toLowerCase().replace(/\s+/g, "-");
    const summary = (formData.get("summary") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const category = (formData.get("category") as string)?.trim() || "Price Action";
    const difficulty = (formData.get("difficulty") as string)?.trim() || "Beginner";
    const estimatedHours = parseInt(formData.get("estimatedHours") as string) || 4;

    if (!title || !slug) return { success: false, error: "Title and slug are required." };

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        summary,
        description,
        category,
        difficulty,
        estimatedHours,
        isPublished: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "CREATE_COURSE",
        targetEntity: "Course",
        targetId: course.id,
        detailsJson: JSON.stringify({ title, slug }),
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    revalidatePath("/dashboard/courses");

    return { success: true, data: course };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create course." };
  }
}

export async function createModule(formData: FormData): Promise<CourseAdminResult> {
  try {
    await ensureAdmin();
    const courseId = formData.get("courseId") as string;
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();

    if (!courseId || !title) return { success: false, error: "Course and module title are required." };

    const count = await prisma.courseModule.count({ where: { courseId } });

    const mod = await prisma.courseModule.create({
      data: {
        courseId,
        title,
        description,
        orderIndex: count + 1,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, data: mod };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create module." };
  }
}

export async function createArticle(formData: FormData): Promise<CourseAdminResult> {
  try {
    const admin = await ensureAdmin();
    const moduleId = formData.get("moduleId") as string;
    const title = (formData.get("title") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim()?.toLowerCase().replace(/\s+/g, "-");
    const summary = (formData.get("summary") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const keyTakeaways = (formData.get("keyTakeaways") as string)?.trim();
    const readingTimeMinutes = parseInt(formData.get("readingTimeMinutes") as string) || 7;

    if (!moduleId || !title || !content) {
      return { success: false, error: "Module, title, and content are required." };
    }

    const count = await prisma.article.count({ where: { moduleId } });

    const article = await prisma.article.create({
      data: {
        moduleId,
        title,
        slug,
        summary: summary || title,
        content,
        keyTakeaways,
        readingTimeMinutes,
        orderIndex: count + 1,
        isPublished: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "CREATE_ARTICLE",
        targetEntity: "Article",
        targetId: article.id,
        detailsJson: JSON.stringify({ title, slug }),
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/dashboard/courses");

    return { success: true, data: article };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create article." };
  }
}
