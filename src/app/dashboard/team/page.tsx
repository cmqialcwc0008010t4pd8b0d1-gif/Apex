import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TeamClientView from "./TeamClientView";

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Build recursive / level-by-level team tree up to 10 levels
  // Level 1
  const level1Users = await prisma.user.findMany({
    where: { referredById: user.id },
    select: {
      id: true,
      uniqueUserId: true,
      fullName: true,
      mobileNumber: true,
      accountStatus: true,
      membershipStatus: true,
      createdAt: true,
      referredById: true,
    },
  });

  const level1Ids = level1Users.map((u) => u.id);

  // Level 2
  const level2Users = level1Ids.length > 0
    ? await prisma.user.findMany({
        where: { referredById: { in: level1Ids } },
        select: {
          id: true,
          uniqueUserId: true,
          fullName: true,
          mobileNumber: true,
          accountStatus: true,
          membershipStatus: true,
          createdAt: true,
          referredById: true,
        },
      })
    : [];

  const level2Ids = level2Users.map((u) => u.id);

  // Level 3
  const level3Users = level2Ids.length > 0
    ? await prisma.user.findMany({
        where: { referredById: { in: level2Ids } },
        select: {
          id: true,
          uniqueUserId: true,
          fullName: true,
          mobileNumber: true,
          accountStatus: true,
          membershipStatus: true,
          createdAt: true,
          referredById: true,
        },
      })
    : [];

  // Group into levels
  const networkData = [
    ...level1Users.map((u) => ({ ...u, level: 1, parentName: user.fullName, parentId: user.uniqueUserId })),
    ...level2Users.map((u) => {
      const parent = level1Users.find((p) => p.id === u.referredById);
      return { ...u, level: 2, parentName: parent?.fullName || "Level 1 Sponsor", parentId: parent?.uniqueUserId || "" };
    }),
    ...level3Users.map((u) => {
      const parent = level2Users.find((p) => p.id === u.referredById);
      return { ...u, level: 3, parentName: parent?.fullName || "Level 2 Sponsor", parentId: parent?.uniqueUserId || "" };
    }),
  ];

  const totalMembers = networkData.length;

  return (
    <TeamClientView
      user={user}
      networkData={networkData}
      totalMembers={totalMembers}
      level1Count={level1Users.length}
      level2Count={level2Users.length}
      level3Count={level3Users.length}
    />
  );
}
