import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ArticleReaderClient from "./ArticleReaderClient";

export default async function ArticleReaderPage({
  params,
}: {
  params: Promise<{ slug: string; articleSlug: string }>;
}) {
  const { slug, articleSlug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          articles: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!course) notFound();

  // Find the current article
  const allArticles = course.modules.flatMap((m) => m.articles);
  const currentIdx = allArticles.findIndex((a) => a.slug === articleSlug);

  if (currentIdx === -1) notFound();

  const article = allArticles[currentIdx];
  const prevArticle = currentIdx > 0 ? allArticles[currentIdx - 1] : null;
  const nextArticle = currentIdx < allArticles.length - 1 ? allArticles[currentIdx + 1] : null;

  // Progress & Bookmark state
  const progress = await prisma.articleProgress.findUnique({
    where: {
      userId_articleId: {
        userId: user.id,
        articleId: article.id,
      },
    },
  });

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId: user.id,
        articleId: article.id,
      },
    },
  });

  // Associated game if any
  const associatedGame = await prisma.interactiveGame.findFirst({
    where: { courseId: course.id, isPublished: true },
  });

  return (
    <ArticleReaderClient
      course={course}
      article={article}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
      initialIsCompleted={progress?.isCompleted || false}
      initialIsBookmarked={!!bookmark}
      associatedGame={associatedGame}
    />
  );
}
