import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EmailsContent() {
  const hasEmails = false; // This should be replaced with actual data check

  if (!hasEmails) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="mail" />
        <EmptyPlaceholder.Title>No emails yet</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Start tracking emails for this company.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add email
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Emails content</p>; // Replace with actual emails content
}
