import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import InteractiveGameEngine from "./InteractiveGameEngine";

export default async function GamePlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const game = await prisma.interactiveGame.findUnique({
    where: { slug },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
      },
      course: {
        select: { title: true, slug: true },
      },
    },
  });

  if (!game) notFound();

  // User past attempts on this game
  const pastAttempts = await prisma.gameAttempt.findMany({
    where: { userId: user.id, gameId: game.id },
    orderBy: { completedAt: "desc" },
    take: 5,
  });

  return (
    <InteractiveGameEngine
      game={game}
      pastAttempts={pastAttempts}
    />
  );
}
