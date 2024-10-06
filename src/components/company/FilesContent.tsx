import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function FilesContent() {
  const hasFiles = false; // This should be replaced with actual data check

  if (!hasFiles) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="file" />
        <EmptyPlaceholder.Title>Ingen filer lastet opp</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Last opp din første fil for dette selskapet.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Last opp fil
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Filinnhold</p>; // Replace with actual files content
}
