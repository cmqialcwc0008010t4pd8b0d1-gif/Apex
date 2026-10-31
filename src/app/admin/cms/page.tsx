import prisma from "@/lib/prisma";
import AdminCmsClient from "./AdminCmsClient";

export default async function AdminCmsPage() {
  const cmsEntries = await prisma.cmsContent.findMany({
    orderBy: { key: "asc" },
  });

  return <AdminCmsClient cmsEntries={cmsEntries} />;
}
