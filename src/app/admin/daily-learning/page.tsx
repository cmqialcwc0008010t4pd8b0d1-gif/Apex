import prisma from "@/lib/prisma";
import AdminDailyLearningClient from "./AdminDailyLearningClient";

export default async function AdminDailyLearningPage() {
  const scheduledLessons = await prisma.dailyLearning.findMany({
    include: {
      article: { select: { title: true } },
      game: { select: { title: true } },
      _count: {
        select: { progressEntries: true },
      },
    },
    orderBy: { date: "desc" },
  });

  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  const games = await prisma.interactiveGame.findMany({
    where: { isPublished: true },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <AdminDailyLearningClient
      scheduledLessons={scheduledLessons}
      articles={articles}
      games={games}
    />
  );
}
