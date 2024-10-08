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
        text="Ditt Dashboard"
      ></DashboardHeader>
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="layout" />
        <EmptyPlaceholder.Title>Finn ditt workspace</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du har ikke lagt til et workspace. Legg til et workspace for å komme i
          gang.
        </EmptyPlaceholder.Description>
        <Button className="mt-4"></Button>
      </EmptyPlaceholder>
    </DashboardShell>
  );
}
