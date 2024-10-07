import { getCurrentUser } from "@/actions/user/get-user-data";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    console.error("No user data found");
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Velkommen, ${user.first_name}!`}
        // text="Ditt Kanban"
      ></DashboardHeader>
      <KanbanBoard />
    </DashboardShell>
  );
}
