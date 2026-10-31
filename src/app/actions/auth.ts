"use server";

import prisma from "@/lib/prisma";
import { hashPassword, comparePassword, createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { normalizeMobileNumber, isValidMobileNumber, formatUniqueUserId, generateReferralCode } from "@/lib/utils";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Handle student registration
 */
export async function registerUser(formData: FormData): Promise<AuthActionResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const rawMobile = (formData.get("mobileNumber") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const rawReferralCode = (formData.get("referralCode") as string)?.trim()?.toUpperCase();

  // 1. Validations
  if (!fullName || fullName.length < 3) {
    return { success: false, error: "Please enter your full legal name (minimum 3 characters)." };
  }

  if (!rawMobile) {
    return { success: false, error: "Mobile number is required." };
  }

  const normalizedMobile = normalizeMobileNumber(rawMobile);
  if (!isValidMobileNumber(normalizedMobile)) {
    return {
      success: false,
      error: "Please enter a valid international mobile number including country code (e.g., +12025550101 or +919876543210).",
    };
  }

  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Password confirmation does not match." };
  }

  // 2. Check for duplicate mobile
  const existingUser = await prisma.user.findUnique({
    where: { mobileNumber: normalizedMobile },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this mobile number already exists. Please sign in or use another number.",
    };
  }

  // 3. Validate Referral Code if provided
  let referrerId: string | null = null;
  if (rawReferralCode) {
    const referrer = await prisma.user.findFirst({
      where: {
        OR: [
          { referralCode: rawReferralCode },
          { uniqueUserId: rawReferralCode },
        ],
      },
    });

    if (referrer) {
      referrerId = referrer.id;
    } else {
      return {
        success: false,
        error: `Referral code "${rawReferralCode}" was not found. Please leave blank or enter a valid referral code.`,
      };
    }
  }

  // 4. Generate sequential Unique User ID (e.g. EDU100004)
  const totalUsers = await prisma.user.count();
  const uniqueUserId = formatUniqueUserId(totalUsers + 1);

  // 5. Generate Unique Referral Code
  let uniqueReferralCode = generateReferralCode();
  let codeExists = await prisma.user.findUnique({ where: { referralCode: uniqueReferralCode } });
  while (codeExists) {
    uniqueReferralCode = generateReferralCode();
    codeExists = await prisma.user.findUnique({ where: { referralCode: uniqueReferralCode } });
  }

  // 6. Hash password securely
  const passwordHash = await hashPassword(password);

  try {
    // 7. Atomic User & Account creation inside transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName,
          mobileNumber: normalizedMobile,
          uniqueUserId,
          referralCode: uniqueReferralCode,
          passwordHash,
          role: "USER",
          accountStatus: "ACTIVE",
          membershipStatus: "PENDING",
          referredById: referrerId,
          membership: {
            create: {
              status: "PENDING",
              price: 20.0,
              currency: "USD",
            },
          },
          walletAccount: {
            create: {
              balance: 0.0,
              pendingWithdrawals: 0.0,
              totalEarned: 0.0,
              totalWithdrawn: 0.0,
            },
          },
        },
      });

      // Create initial welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to ApexEdge Trading Academy",
          message: `Your student ID is ${user.uniqueUserId}. Next step: Navigate to 'My Membership' to submit your manual activation request.`,
          type: "SYSTEM",
        },
      });

      return user;
    });

    // 8. Sign in immediately by setting session cookie
    const token = await createSessionToken({
      userId: newUser.id,
      uniqueUserId: newUser.uniqueUserId,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    await setSessionCookie(token);

    return {
      success: true,
      data: {
        userId: newUser.id,
        uniqueUserId: newUser.uniqueUserId,
      },
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.message || "A server error occurred during registration. Please try again.",
    };
  }
}

/**
 * Handle user / admin login
 */
export async function loginUser(formData: FormData): Promise<AuthActionResult> {
  const rawMobile = (formData.get("mobileNumber") as string)?.trim();
  const password = formData.get("password") as string;

  if (!rawMobile || !password) {
    return { success: false, error: "Please enter your mobile number and password." };
  }

  const normalizedMobile = normalizeMobileNumber(rawMobile);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { mobileNumber: normalizedMobile },
        { mobileNumber: rawMobile },
        { uniqueUserId: rawMobile.toUpperCase() }, // Allow logging in with Unique ID too
      ],
    },
  });

  if (!user) {
    return { success: false, error: "Invalid credentials. Please verify your mobile number/ID." };
  }

  if (user.accountStatus === "SUSPENDED") {
    return { success: false, error: "This account has been suspended by compliance. Please contact support." };
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);
  if (!passwordMatch) {
    return { success: false, error: "Invalid credentials. Incorrect password." };
  }

  // Generate session token
  const token = await createSessionToken({
    userId: user.id,
    uniqueUserId: user.uniqueUserId,
    role: user.role,
    fullName: user.fullName,
  });

  await setSessionCookie(token);

  return {
    success: true,
    data: {
      role: user.role,
      uniqueUserId: user.uniqueUserId,
    },
  };
}

/**
 * Handle Logout
 */
export async function logoutUser() {
  await clearSessionCookie();
  redirect("/login");
}

/**
 * Admin-assisted account recovery request
 */
export async function submitPasswordResetRequest(formData: FormData): Promise<AuthActionResult> {
  const rawMobile = (formData.get("mobileNumber") as string)?.trim();
  const uniqueUserId = (formData.get("uniqueUserId") as string)?.trim()?.toUpperCase();
  const explanation = (formData.get("explanation") as string)?.trim();

  if (!rawMobile) {
    return { success: false, error: "Registered mobile number is required." };
  }

  const normalizedMobile = normalizeMobileNumber(rawMobile);
  const user = await prisma.user.findUnique({
    where: { mobileNumber: normalizedMobile },
  });

  if (!user) {
    return {
      success: false,
      error: "No account found matching this mobile number.",
    };
  }

  // Create recovery support ticket
  await prisma.supportTicket.create({
    data: {
      ticketNumber: `REC-${Date.now().toString().slice(-5)}`,
      userId: user.id,
      subject: `Account Recovery Request for ${user.uniqueUserId}`,
      category: "Account",
      priority: "HIGH",
      status: "OPEN",
      messages: {
        create: {
          senderId: user.id,
          senderRole: "USER",
          message: `User requested password reset assistance without OTP provider. Unique ID: ${uniqueUserId || user.uniqueUserId}. Student Note: ${explanation || "Standard recovery assistance requested."}`,
        },
      },
    },
  });

  return {
    success: true,
    data: {
      message: "Recovery request submitted to compliance desk. An administrator will verify your credentials and assist you.",
    },
  };
}
