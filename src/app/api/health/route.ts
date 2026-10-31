import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Check DB query execution
    const userCount = await prisma.user.count();
    const platform = await prisma.platformSetting.findFirst();
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "HEALTHY",
      database: "CONNECTED (SQLite / Prisma)",
      totalRegisteredUsers: userCount,
      platformName: platform?.siteName || "ApexEdge Trading Academy",
      maintenanceMode: platform?.maintenanceMode || false,
      complianceHoldActive: platform?.complianceHoldEnabled || true,
      responseTimeMs: responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "UNHEALTHY",
        error: error.message || "Failed to query database",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
