import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TicketThreadClient from "./TicketThreadClient";

export default async function TicketThreadPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      messages: {
        include: {
          sender: {
            select: { fullName: true, role: true, uniqueUserId: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      user: {
        select: { fullName: true, uniqueUserId: true, mobileNumber: true },
      },
    },
  });

  if (!ticket) notFound();

  // If not admin and not ticket owner, deny
  if (user.role === "USER" && ticket.userId !== user.id) {
    notFound();
  }

  return (
    <TicketThreadClient
      user={user}
      ticket={ticket}
    />
  );
}
