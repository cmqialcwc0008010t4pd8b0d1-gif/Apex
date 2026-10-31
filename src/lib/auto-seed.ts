import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function ensureSeeded() {
  try {
    const userCount = await prisma.user.count().catch(() => 0);
    if (userCount > 0) {
      return { seeded: false, reason: "Already seeded" };
    }

    console.log("[AutoSeed] Database is empty. Seeding core users and settings...");

    // 1. Platform Settings
    await prisma.platformSetting.upsert({
      where: { id: "global-platform-setting" },
      update: {},
      create: {
        id: "global-platform-setting",
        siteName: "ApexEdge Trading Academy",
        tagline: "Professional, Institutional-Grade Financial & Trading Education",
        supportEmail: "support@apexedgetrading.internal",
        supportPhone: "+1-800-APEX-EDU",
        defaultCurrency: "USD",
        membershipPrice: 20.0,
        maintenanceMode: false,
        registrationEnabled: true,
        withdrawalsEnabled: false,
        complianceHoldEnabled: true,
      },
    });

    // 2. Payment Settings
    await prisma.paymentSetting.upsert({
      where: { id: "default-payment-setting" },
      update: {},
      create: {
        id: "default-payment-setting",
        amount: 20.0,
        currency: "USDT",
        bep20Address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
        trc20Address: "TX9qZVa59z6W24Y2D6F7gK1mR3o9H7jL8w",
        bep20Active: true,
        trc20Active: true,
        instructions: "Transfer exactly $20 USDT to the selected address. Submit transaction hash for verification.",
        reviewWindowNotice: "Verification is conducted manually. Review window is 2-3 hours.",
      },
    });

    // 3. Super Admin
    const adminHash = await hashPassword("Admin@Trading2026!");
    const admin = await prisma.user.upsert({
      where: { mobileNumber: "+10000000000" },
      update: {},
      create: {
        uniqueUserId: "EDU100000",
        fullName: "Chief System Administrator",
        mobileNumber: "+10000000000",
        passwordHash: adminHash,
        referralCode: "APEXADMIN",
        role: "SUPER_ADMIN",
        accountStatus: "ACTIVE",
      },
    });

    await prisma.membership.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        status: "ACTIVE",
        activatedAt: new Date(),
      },
    });

    await prisma.walletAccount.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        balance: 0.0,
      },
    });

    // 4. Active Student User
    const studentHash = await hashPassword("Student@123");
    const activeStudent = await prisma.user.upsert({
      where: { mobileNumber: "+12025550101" },
      update: {},
      create: {
        uniqueUserId: "EDU100001",
        fullName: "Marcus Sterling (Active Student)",
        mobileNumber: "+12025550101",
        passwordHash: studentHash,
        referralCode: "REF88101",
        role: "USER",
        accountStatus: "ACTIVE",
        referredById: admin.id,
      },
    });

    await prisma.membership.upsert({
      where: { userId: activeStudent.id },
      update: {},
      create: {
        userId: activeStudent.id,
        status: "ACTIVE",
        activatedAt: new Date(),
      },
    });

    await prisma.walletAccount.upsert({
      where: { userId: activeStudent.id },
      update: {},
      create: {
        userId: activeStudent.id,
        balance: 45.0,
      },
    });

    // 5. Pending Student User
    const pendingStudent = await prisma.user.upsert({
      where: { mobileNumber: "+12025550103" },
      update: {},
      create: {
        uniqueUserId: "EDU100003",
        fullName: "Elena Rostova (Pending Student)",
        mobileNumber: "+12025550103",
        passwordHash: studentHash,
        referralCode: "REF88103",
        role: "USER",
        accountStatus: "ACTIVE",
        referredById: activeStudent.id,
      },
    });

    await prisma.membership.upsert({
      where: { userId: pendingStudent.id },
      update: {},
      create: {
        userId: pendingStudent.id,
        status: "PENDING_ACTIVATION",
      },
    });

    await prisma.walletAccount.upsert({
      where: { userId: pendingStudent.id },
      update: {},
      create: {
        userId: pendingStudent.id,
        balance: 0.0,
      },
    });

    console.log("[AutoSeed] Successfully created default users and settings!");
    return { seeded: true };
  } catch (error) {
    console.error("[AutoSeed Error]:", error);
    return { seeded: false, error };
  }
}
