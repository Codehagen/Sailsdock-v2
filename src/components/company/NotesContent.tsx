import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddNoteSheet } from "@/components/company/AddNoteSheet";
import { TooltipProvider } from "@/components/ui/tooltip";

export function NotesContent() {
  const hasNotes = false; // This should be replaced with actual data check

  return (
    <TooltipProvider>
      {!hasNotes ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="file" />
          <EmptyPlaceholder.Title>Ingen notater</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Begynn å legge til notater for dette selskapet.
          </EmptyPlaceholder.Description>
          <AddNoteSheet />
        </EmptyPlaceholder>
      ) : (
        <div>
          <AddNoteSheet />
          <p>Notatinnhold</p>
        </div>
      )}
    </TooltipProvider>
  );
}
