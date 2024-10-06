import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EmailsContent() {
  const hasEmails = false; // This should be replaced with actual data check

  if (!hasEmails) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="mail" />
        <EmptyPlaceholder.Title>Ingen e-poster ennå</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Begynn å spore e-poster for dette selskapet.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Legg til e-post
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>E-postinnhold</p>; // Replace with actual emails content
}
