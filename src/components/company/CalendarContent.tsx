import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CalendarContent() {
  const hasEvents = false; // This should be replaced with actual data check

  if (!hasEvents) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="calendar" />
        <EmptyPlaceholder.Title>No events scheduled</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Schedule your first event for this company.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add event
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Calendar content</p>; // Replace with actual calendar content
}
