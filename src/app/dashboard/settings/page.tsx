import { getCurrentUser } from "@/lib/auth";
import SettingsClientView from "./SettingsClientView";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <SettingsClientView user={user} />;
}
