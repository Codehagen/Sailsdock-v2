import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function FilesContent() {
  const hasFiles = false; // This should be replaced with actual data check

  if (!hasFiles) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="file" />
        <EmptyPlaceholder.Title>No files uploaded</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Upload your first file for this company.
        </EmptyPlaceholder.Description>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Upload file
        </Button>
      </EmptyPlaceholder>
    );
  }

  return <p>Files content</p>; // Replace with actual files content
}
