import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NotesContent() {
  const hasNotes = false; // This should be replaced with actual data check

  if (!hasNotes) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="file" />
        <EmptyPlaceholder.Title>Ingen notater</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Begynn å legge til notater for dette selskapet.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Legg til notat
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Notatinnhold</p>; // Replace with actual notes content
}
