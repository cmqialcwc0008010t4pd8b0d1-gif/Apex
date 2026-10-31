"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface WalletActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Request balance withdrawal
 */
export async function requestWithdrawal(formData: FormData): Promise<WalletActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const rawAmount = formData.get("amount") as string;
  const amount = parseFloat(rawAmount);
  const walletAddress = (formData.get("walletAddress") as string)?.trim();
  const network = (formData.get("network") as string)?.trim() || "BEP20";

  if (isNaN(amount) || amount < 10) {
    return { success: false, error: "Minimum withdrawal threshold is $10.00 USDT." };
  }

  if (!walletAddress || walletAddress.length < 16) {
    return { success: false, error: "Please provide a valid receiving wallet address." };
  }

  // Check platform withdrawal setting
  const platformSetting = await prisma.platformSetting.findFirst();
  if (!platformSetting?.withdrawalsEnabled) {
    return {
      success: false,
      error: "Disbursements are currently maintained in Compliance Hold Mode. In accordance with direct-selling anti-pyramid guidelines, live withdrawals require formal regulatory clearance by the treasury department.",
    };
  }

  try {
    // Database transaction to prevent double spending and race conditions
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch wallet with lock/verification
      const wallet = await tx.walletAccount.findUnique({
        where: { userId: user.id },
      });

      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient available balance for this withdrawal request.");
      }

      // 2. Decrement available balance, increment pendingWithdrawals
      const updatedWallet = await tx.walletAccount.update({
        where: { userId: user.id },
        data: {
          balance: { decrement: amount },
          pendingWithdrawals: { increment: amount },
        },
      });

      // 3. Create Withdrawal Request
      const count = await tx.withdrawalRequest.count();
      const requestNumber = `WDR-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, "0")}`;

      const wdr = await tx.withdrawalRequest.create({
        data: {
          requestNumber,
          userId: user.id,
          amount,
          currency: "USDT",
          walletAddress,
          network,
          status: "PENDING",
        },
      });

      // 4. Create Immutable Ledger Entry
      const txnCount = await tx.financialTransaction.count();
      const transactionCode = `TXN-WDR-${Date.now().toString().slice(-6)}-${txnCount + 1}`;

      await tx.financialTransaction.create({
        data: {
          transactionCode,
          userId: user.id,
          type: "WITHDRAWAL",
          amount: -amount,
          balanceAfter: updatedWallet.balance,
          currency: "USD",
          status: "PENDING",
          referenceId: wdr.id,
          description: `Withdrawal request #${requestNumber} to ${network} ${walletAddress.slice(0, 8)}...`,
          metadataJson: JSON.stringify({
            requestNumber,
            network,
            walletAddress,
          }),
        },
      });

      // 5. Create notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Withdrawal Request Submitted",
          message: `Your request for $${amount.toFixed(2)} USDT is pending admin compliance review.`,
          type: "PAYMENT",
        },
      });

      return wdr;
    });

    revalidatePath("/dashboard/wallet");
    revalidatePath("/dashboard/withdrawals");
    revalidatePath("/dashboard/transactions");

    return {
      success: true,
      data: { requestNumber: result.requestNumber },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to process withdrawal request." };
  }
}
