import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TasksContent() {
  const hasTasks = false; // This should be replaced with actual data check

  if (!hasTasks) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="checkSquare" />
        <EmptyPlaceholder.Title>No tasks yet</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Create your first task for this company.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add task
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Tasks content</p>; // Replace with actual tasks content
}
