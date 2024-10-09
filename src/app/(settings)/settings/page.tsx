import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import SettingsDashboard from "@/components/settings/SettingsDashboard";
import { getCurrentUser } from "@/actions/user/get-user-data";
import { User } from "@/types/user";

export default async function SettingsPage() {
  const userData = await getCurrentUser();

  if (!userData) {
    // Handle the case where no user is found
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Innstillinger"
          text="Administrer dine innstillinger"
        />
        <div>No user data available. Please log in.</div>
      </DashboardShell>
    );
  }

  const user: User = userData;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Innstillinger"
        text="Administrer dine innstillinger"
      />
      <SettingsDashboard user={user} />
    </DashboardShell>
  );
}
