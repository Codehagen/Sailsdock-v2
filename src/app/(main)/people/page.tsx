import { getCurrentUser } from "@/actions/user/get-user-data";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { Button } from "@/components/ui/button";

export default async function PeoplePage() {
  const user = await getCurrentUser();

  if (!user) {
    console.error("No user data found");
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={"Personer"}
        text="Dine personer"
      ></DashboardHeader>
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="user" />
        <EmptyPlaceholder.Title>Legg til person</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du har ikke lagt til noen personer. Legg til en person for å komme i
          gang.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">Legg til person</Button>
      </EmptyPlaceholder>
    </DashboardShell>
  );
}
