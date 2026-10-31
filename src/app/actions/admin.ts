"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface AdminActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

// Role guard helper
async function ensureAdminUser() {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "FINANCE_ADMIN", "COURSE_MANAGER", "SUPPORT_ADMIN", "ANALYST"].includes(user.role)) {
    throw new Error("Access Denied: Administrative privileges required.");
  }
  return user;
}

/**
 * Approve Manual Payment Request (Treasury Verification)
 */
export async function approvePaymentRequest(requestId: string, notes?: string): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    await prisma.$transaction(async (tx) => {
      const request = await tx.paymentRequest.findUnique({
        where: { id: requestId },
        include: { user: true },
      });

      if (!request) throw new Error("Payment request not found.");
      if (request.status === "APPROVED") throw new Error("Payment is already approved.");

      // 1. Update Payment Request status
      await tx.paymentRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          adminNotes: notes || "Payment verified on-chain by treasury compliance officer.",
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });

      // 2. Activate User Membership
      await tx.user.update({
        where: { id: request.userId },
        data: { membershipStatus: "ACTIVE" },
      });

      await tx.membership.upsert({
        where: { userId: request.userId },
        update: {
          status: "ACTIVE",
          activatedAt: new Date(),
          notes: `Verified on ${request.network} TXID: ${request.txHash}`,
        },
        create: {
          userId: request.userId,
          status: "ACTIVE",
          price: request.amount,
          currency: "USD",
          activatedAt: new Date(),
          notes: `Verified on ${request.network} TXID: ${request.txHash}`,
        },
      });

      // 3. Create Immutable Financial Transaction Record for verified revenue
      const txnCount = await tx.financialTransaction.count();
      const transactionCode = `TXN-REV-${Date.now().toString().slice(-6)}-${txnCount + 1}`;

      await tx.financialTransaction.create({
        data: {
          transactionCode,
          userId: request.userId,
          type: "MEMBERSHIP_PURCHASE",
          amount: request.amount,
          balanceAfter: 0, // Membership purchases are educational revenue, not user deposit balances
          currency: "USD",
          status: "COMPLETED",
          referenceId: request.id,
          description: `Verified ${request.network} membership activation ($${request.amount}) TXID: ${request.txHash}`,
          metadataJson: JSON.stringify({
            paymentRequestId: request.id,
            txHash: request.txHash,
            network: request.network,
            receivingAddress: request.receivingAddress,
            approvedByAdminId: admin.id,
          }),
        },
      });

      // 4. Send Student Notification
      await tx.notification.create({
        data: {
          userId: request.userId,
          title: "Membership Verified & Activated!",
          message: `Your $${request.amount} USDT payment on ${request.network} has been confirmed. You now have full lifetime access to all articles and interactive simulators.`,
          type: "PAYMENT",
        },
      });

      // 5. Create Audit Log
      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: "APPROVE_PAYMENT",
          targetEntity: "PaymentRequest",
          targetId: request.id,
          detailsJson: JSON.stringify({
            amount: request.amount,
            txHash: request.txHash,
            targetUserId: request.userId,
            studentUniqueId: request.user.uniqueUserId,
          }),
        },
      });
    });

    revalidatePath("/admin");
    revalidatePath("/admin/payments");
    revalidatePath("/admin/users");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/membership");

    return { success: true, data: { message: "Payment approved and membership activated." } };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to approve payment." };
  }
}

/**
 * Reject Manual Payment Request
 */
export async function rejectPaymentRequest(requestId: string, reason: string): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    await prisma.$transaction(async (tx) => {
      const request = await tx.paymentRequest.findUnique({
        where: { id: requestId },
        include: { user: true },
      });

      if (!request) throw new Error("Payment request not found.");

      await tx.paymentRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          adminNotes: reason,
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: request.userId },
        data: { membershipStatus: "PENDING" },
      });

      await tx.membership.upsert({
        where: { userId: request.userId },
        update: { status: "PENDING", notes: `Rejected: ${reason}` },
        create: { userId: request.userId, status: "PENDING", notes: `Rejected: ${reason}` },
      });

      // Notification
      await tx.notification.create({
        data: {
          userId: request.userId,
          title: "Payment Request Rejected",
          message: `Your payment submission was rejected by compliance. Reason: ${reason}. Please re-submit with a valid on-chain TXID.`,
          type: "PAYMENT",
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: "REJECT_PAYMENT",
          targetEntity: "PaymentRequest",
          targetId: request.id,
          detailsJson: JSON.stringify({ reason, targetUserId: request.userId }),
        },
      });
    });

    revalidatePath("/admin/payments");
    revalidatePath("/dashboard/membership");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reject payment." };
  }
}

/**
 * Approve Withdrawal Request & Record Payment Reference
 */
export async function approveWithdrawalRequest(requestId: string, paymentReference: string): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    await prisma.$transaction(async (tx) => {
      const wdr = await tx.withdrawalRequest.findUnique({
        where: { id: requestId },
      });

      if (!wdr) throw new Error("Withdrawal request not found.");
      if (wdr.status === "APPROVED") throw new Error("Withdrawal is already approved.");

      // 1. Update Withdrawal Request
      await tx.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          paymentReference: paymentReference || `DISB-${Date.now().toString().slice(-8)}`,
          processedAt: new Date(),
          processedById: admin.id,
        },
      });

      // 2. Decrement pendingWithdrawals, increment totalWithdrawn
      await tx.walletAccount.update({
        where: { userId: wdr.userId },
        data: {
          pendingWithdrawals: { decrement: wdr.amount },
          totalWithdrawn: { increment: wdr.amount },
        },
      });

      // 3. Update Financial Transaction status
      await tx.financialTransaction.updateMany({
        where: { referenceId: wdr.id },
        data: { status: "COMPLETED" },
      });

      // 4. Notification
      await tx.notification.create({
        data: {
          userId: wdr.userId,
          title: "Withdrawal Disbursed",
          message: `Your withdrawal of $${wdr.amount.toFixed(2)} USDT has been executed. Reference: ${paymentReference}`,
          type: "PAYMENT",
        },
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: "APPROVE_WITHDRAWAL",
          targetEntity: "WithdrawalRequest",
          targetId: wdr.id,
          detailsJson: JSON.stringify({
            amount: wdr.amount,
            paymentReference,
            walletAddress: wdr.walletAddress,
          }),
        },
      });
    });

    revalidatePath("/admin/finance");
    revalidatePath("/admin/withdrawals");
    revalidatePath("/dashboard/wallet");
    revalidatePath("/dashboard/withdrawals");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to approve withdrawal." };
  }
}

/**
 * Reject Withdrawal Request & Refund Locked Balance
 */
export async function rejectWithdrawalRequest(requestId: string, reason: string): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    await prisma.$transaction(async (tx) => {
      const wdr = await tx.withdrawalRequest.findUnique({
        where: { id: requestId },
      });

      if (!wdr) throw new Error("Withdrawal request not found.");

      // 1. Update status
      await tx.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          rejectReason: reason,
          processedAt: new Date(),
          processedById: admin.id,
        },
      });

      // 2. Return funds from pendingWithdrawals back to available balance
      const updatedWallet = await tx.walletAccount.update({
        where: { userId: wdr.userId },
        data: {
          pendingWithdrawals: { decrement: wdr.amount },
          balance: { increment: wdr.amount },
        },
      });

      // 3. Log Adjustment transaction
      const count = await tx.financialTransaction.count();
      await tx.financialTransaction.create({
        data: {
          transactionCode: `TXN-REFUND-${Date.now().toString().slice(-6)}-${count + 1}`,
          userId: wdr.userId,
          type: "REFUND",
          amount: wdr.amount,
          balanceAfter: updatedWallet.balance,
          currency: "USD",
          status: "COMPLETED",
          referenceId: wdr.id,
          description: `Refund of rejected withdrawal #${wdr.requestNumber}: ${reason}`,
        },
      });

      // 4. Notification
      await tx.notification.create({
        data: {
          userId: wdr.userId,
          title: "Withdrawal Request Rejected",
          message: `Withdrawal #${wdr.requestNumber} of $${wdr.amount.toFixed(2)} was rejected. Reason: ${reason}. Funds returned to your available balance.`,
          type: "PAYMENT",
        },
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: "REJECT_WITHDRAWAL",
          targetEntity: "WithdrawalRequest",
          targetId: wdr.id,
          detailsJson: JSON.stringify({ reason, amount: wdr.amount }),
        },
      });
    });

    revalidatePath("/admin/finance");
    revalidatePath("/dashboard/wallet");
    revalidatePath("/dashboard/withdrawals");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reject withdrawal." };
  }
}

/**
 * Update Platform Settings
 */
export async function updatePlatformSettings(formData: FormData): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    const siteName = formData.get("siteName") as string;
    const supportEmail = formData.get("supportEmail") as string;
    const supportPhone = formData.get("supportPhone") as string;
    const membershipPrice = parseFloat(formData.get("membershipPrice") as string);
    const maintenanceMode = formData.get("maintenanceMode") === "true";
    const registrationEnabled = formData.get("registrationEnabled") === "true";
    const withdrawalsEnabled = formData.get("withdrawalsEnabled") === "true";
    const complianceHoldEnabled = formData.get("complianceHoldEnabled") === "true";

    await prisma.platformSetting.upsert({
      where: { id: "global-platform-setting" },
      update: {
        siteName,
        supportEmail,
        supportPhone,
        membershipPrice: isNaN(membershipPrice) ? 20.0 : membershipPrice,
        maintenanceMode,
        registrationEnabled,
        withdrawalsEnabled,
        complianceHoldEnabled,
        updatedBy: admin.id,
      },
      create: {
        id: "global-platform-setting",
        siteName,
        supportEmail,
        supportPhone,
        membershipPrice: isNaN(membershipPrice) ? 20.0 : membershipPrice,
        maintenanceMode,
        registrationEnabled,
        withdrawalsEnabled,
        complianceHoldEnabled,
        updatedBy: admin.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "UPDATE_PLATFORM_SETTINGS",
        targetEntity: "PlatformSetting",
        detailsJson: JSON.stringify({ siteName, maintenanceMode, withdrawalsEnabled }),
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update platform settings." };
  }
}

/**
 * Update Receiving Wallet Configuration
 */
export async function updatePaymentSettings(formData: FormData): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    const amount = parseFloat(formData.get("amount") as string);
    const bep20Address = formData.get("bep20Address") as string;
    const trc20Address = formData.get("trc20Address") as string;
    const bep20Active = formData.get("bep20Active") === "true";
    const trc20Active = formData.get("trc20Active") === "true";
    const instructions = formData.get("instructions") as string;
    const reviewWindowNotice = formData.get("reviewWindowNotice") as string;

    await prisma.paymentSetting.upsert({
      where: { id: "default-payment-setting" },
      update: {
        amount: isNaN(amount) ? 20.0 : amount,
        bep20Address,
        trc20Address,
        bep20Active,
        trc20Active,
        instructions,
        reviewWindowNotice,
      },
      create: {
        id: "default-payment-setting",
        amount: isNaN(amount) ? 20.0 : amount,
        bep20Address,
        trc20Address,
        bep20Active,
        trc20Active,
        instructions,
        reviewWindowNotice,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "UPDATE_PAYMENT_CONFIG",
        targetEntity: "PaymentSetting",
        detailsJson: JSON.stringify({ bep20Address, trc20Address, amount }),
      },
    });

    revalidatePath("/admin/payments");
    revalidatePath("/dashboard/membership");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update payment settings." };
  }
}

/**
 * Update User Account Status / Role / Membership Status
 */
export async function updateUserManagement(formData: FormData): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;
    const accountStatus = formData.get("accountStatus") as string;
    const membershipStatus = formData.get("membershipStatus") as string;

    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        accountStatus,
        membershipStatus,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "UPDATE_USER",
        targetEntity: "User",
        targetId: userId,
        detailsJson: JSON.stringify({ role, accountStatus, membershipStatus }),
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user." };
  }
}

/**
 * Send System Announcement / User Notification
 */
export async function broadcastNotification(formData: FormData): Promise<AdminActionResult> {
  try {
    const admin = await ensureAdminUser();

    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const target = formData.get("target") as string; // ALL, ACTIVE_ONLY

    const users = await prisma.user.findMany({
      where: target === "ACTIVE_ONLY" ? { membershipStatus: "ACTIVE" } : {},
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title,
        message,
        type: "SYSTEM",
      })),
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "BROADCAST_NOTIFICATION",
        targetEntity: "Notification",
        detailsJson: JSON.stringify({ title, recipientsCount: users.length }),
      },
    });

    revalidatePath("/admin/notifications");

    return { success: true, data: { count: users.length } };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to broadcast notification." };
  }
}
