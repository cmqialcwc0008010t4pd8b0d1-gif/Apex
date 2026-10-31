"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface SupportActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Create a new support ticket
 */
export async function createTicket(formData: FormData): Promise<SupportActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const subject = (formData.get("subject") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "General";
  const priority = (formData.get("priority") as string)?.trim() || "MEDIUM";
  const message = (formData.get("message") as string)?.trim();

  if (!subject || subject.length < 5) {
    return { success: false, error: "Please enter a descriptive subject (minimum 5 characters)." };
  }

  if (!message || message.length < 10) {
    return { success: false, error: "Please describe your question or issue (minimum 10 characters)." };
  }

  try {
    const count = await prisma.supportTicket.count();
    const ticketNumber = `TKT-${(1000 + count + 1).toString()}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: user.id,
        subject,
        category,
        priority,
        status: "OPEN",
        messages: {
          create: {
            senderId: user.id,
            senderRole: user.role === "USER" ? "USER" : "ADMIN",
            message,
          },
        },
      },
    });

    revalidatePath("/dashboard/support");
    revalidatePath("/admin/support");

    return { success: true, data: { ticketId: ticket.id, ticketNumber } };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create support ticket." };
  }
}

/**
 * Send reply message on ticket
 */
export async function sendTicketMessage(formData: FormData): Promise<SupportActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const ticketId = formData.get("ticketId") as string;
  const message = (formData.get("message") as string)?.trim();

  if (!ticketId || !message) {
    return { success: false, error: "Message content cannot be blank." };
  }

  try {
    await prisma.supportMessage.create({
      data: {
        ticketId,
        senderId: user.id,
        senderRole: user.role === "USER" ? "USER" : "ADMIN",
        message,
      },
    });

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: user.role === "USER" ? "OPEN" : "IN_PROGRESS",
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/support/${ticketId}`);
    revalidatePath(`/admin/support/${ticketId}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to post message." };
  }
}
