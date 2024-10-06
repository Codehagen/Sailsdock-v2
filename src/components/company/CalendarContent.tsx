import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CalendarContent() {
  const hasEvents = false; // This should be replaced with actual data check

  if (!hasEvents) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="calendar" />
        <EmptyPlaceholder.Title>
          Ingen hendelser planlagt
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Planlegg din første hendelse for dette selskapet.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Legg til hendelse
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Kalenderinnhold</p>; // Replace with actual calendar content
}
