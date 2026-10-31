import prisma from "@/lib/prisma";
import AdminSettingsClient from "./AdminSettingsClient";

export default async function AdminSettingsPage() {
  const setting = await prisma.platformSetting.findFirst();

  return <AdminSettingsClient setting={setting} />;
}
