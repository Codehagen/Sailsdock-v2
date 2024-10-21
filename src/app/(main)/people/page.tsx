import { getCurrentUser } from "@/actions/user/get-user-data";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";

export default async function PeoplePage() {
  const user = await getCurrentUser();

  if (!user) {
    console.error("No user data found");
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Personer</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <Button>Legg til person</Button>
        </div>
      </div>

      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="user" />
        <EmptyPlaceholder.Title>Legg til person</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du har ikke lagt til noen personer. Legg til en person for å komme i
          gang.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">Legg til person</Button>
      </EmptyPlaceholder>
    </div>
  );
}
