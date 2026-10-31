import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SupportClientView from "./SupportClientView";

export default async function SupportPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <SupportClientView
      user={user}
      tickets={tickets}
    />
  );
}
