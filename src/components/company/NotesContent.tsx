import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NotesContent() {
  const hasNotes = false; // This should be replaced with actual data check

  if (!hasNotes) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="file" />
        <EmptyPlaceholder.Title>No notes yet</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Start adding notes for this company.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add note
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Notes content</p>; // Replace with actual notes content
}
