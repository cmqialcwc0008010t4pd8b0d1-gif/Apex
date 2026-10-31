"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser, comparePassword, hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface SettingsActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Change student password
 */
export async function changePassword(formData: FormData): Promise<SettingsActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  if (!currentPassword || !newPassword) {
    return { success: false, error: "Please fill in all password fields." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  if (newPassword !== confirmNewPassword) {
    return { success: false, error: "New password confirmation does not match." };
  }

  const matches = await comparePassword(currentPassword, user.passwordHash);
  if (!matches) {
    return { success: false, error: "Current password does not match our records." };
  }

  const newHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return { success: true, data: { message: "Password updated successfully." } };
}
