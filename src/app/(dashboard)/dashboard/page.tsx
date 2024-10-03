import { getCurrentUser } from "@/actions/user/get-user-data";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { Button } from "@/components/ui/button";

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
        text="Dine leietakere"
      ></DashboardHeader>
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="user" />
        <EmptyPlaceholder.Title>Finn ditt workspace</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du har ikke lagt til et workspace ennå. Legg til et workspace for å
          komme i gang.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">Create New Project</Button>
      </EmptyPlaceholder>
    </DashboardShell>
  );
}
