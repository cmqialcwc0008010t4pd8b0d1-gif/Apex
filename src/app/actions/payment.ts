"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface PaymentActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Submit manual payment verification request
 */
export async function submitPaymentRequest(formData: FormData): Promise<PaymentActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const network = (formData.get("network") as string)?.trim()?.toUpperCase();
  const txHash = (formData.get("txHash") as string)?.trim();
  const receivingAddress = (formData.get("receivingAddress") as string)?.trim();
  const screenshotUrl = (formData.get("screenshotUrl") as string)?.trim() || "/images/receipts/user-receipt.png";

  if (!network || !["BEP20", "TRC20"].includes(network)) {
    return { success: false, error: "Please select a supported blockchain network (BEP20 or TRC20)." };
  }

  if (!txHash || txHash.length < 16) {
    return { success: false, error: "Please enter a valid, complete transaction hash (TXID)." };
  }

  // Prevent duplicate transaction hashes
  const existingTx = await prisma.paymentRequest.findUnique({
    where: { txHash },
  });

  if (existingTx) {
    return {
      success: false,
      error: "This transaction hash has already been submitted. Duplicate submissions are strictly rejected.",
    };
  }

  try {
    const paymentSetting = await prisma.paymentSetting.findFirst();
    const amount = paymentSetting?.amount || 20.0;

    await prisma.$transaction(async (tx) => {
      // 1. Create Payment Request with status UNDER_REVIEW
      await tx.paymentRequest.create({
        data: {
          userId: user.id,
          amount,
          currency: "USDT",
          network,
          receivingAddress: receivingAddress || (network === "BEP20" ? paymentSetting?.bep20Address || "0x..." : paymentSetting?.trc20Address || "T..."),
          txHash,
          screenshotUrl,
          status: "UNDER_REVIEW",
          adminNotes: "Submitted by user. Manual blockchain verification queued.",
        },
      });

      // 2. Set user's membership status to UNDER_REVIEW
      await tx.user.update({
        where: { id: user.id },
        data: { membershipStatus: "UNDER_REVIEW" },
      });

      await tx.membership.upsert({
        where: { userId: user.id },
        update: { status: "UNDER_REVIEW" },
        create: {
          userId: user.id,
          status: "UNDER_REVIEW",
          price: amount,
          currency: "USD",
        },
      });

      // 3. Create Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Payment Request Queued For Manual Audit",
          message: `Your $${amount} USDT (${network}) payment with TXID ${txHash.slice(0, 10)}... is currently under review by compliance officers (estimated 2-3 hours).`,
          type: "PAYMENT",
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/membership");
    revalidatePath("/admin/payments");

    return {
      success: true,
      data: { message: "Payment request successfully submitted for manual review." },
    };
  } catch (err: any) {
    console.error("Submit payment request error:", err);
    return { success: false, error: err.message || "Failed to submit payment request." };
  }
}
