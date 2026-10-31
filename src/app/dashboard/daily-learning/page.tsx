import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DailyLearningClient from "./DailyLearningClient";

export default async function DailyLearningPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  // Today's lesson
  const todayLesson = await prisma.dailyLearning.findUnique({
    where: { date: todayStr },
    include: {
      article: {
        include: { module: { include: { course: true } } },
      },
      game: true,
    },
  });

  // Today's completion status
  const todayProgress = todayLesson
    ? await prisma.dailyLearningProgress.findUnique({
        where: {
          userId_dailyLearningId: {
            userId: user.id,
            dailyLearningId: todayLesson.id,
          },
        },
      })
    : null;

  // Total completed days (streak count)
  const allUserDailyProgress = await prisma.dailyLearningProgress.findMany({
    where: { userId: user.id, completed: true },
    include: { dailyLearning: true },
    orderBy: { completedAt: "desc" },
  });

  // Past daily lessons
  const pastLessons = await prisma.dailyLearning.findMany({
    where: { isPublished: true },
    include: {
      article: true,
      game: true,
      progressEntries: {
        where: { userId: user.id },
      },
    },
    orderBy: { date: "desc" },
    take: 10,
  });

  return (
    <DailyLearningClient
      user={user}
      todayLesson={todayLesson}
      todayProgress={todayProgress}
      completedDaysCount={allUserDailyProgress.length}
      pastLessons={pastLessons}
    />
  );
}
