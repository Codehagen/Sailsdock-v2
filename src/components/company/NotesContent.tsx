"use client";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddNoteSheet } from "@/components/company/AddNoteSheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MinimalTiptapEditor } from "@/components/notes/minimal-tiptap/minimal-tiptap";
import { useState } from "react";
import { Content } from "@tiptap/react";

export function NotesContent() {
  const [hasNotes, setHasNotes] = useState(false); // This should be replaced with actual data check
  const [noteContent, setNoteContent] = useState<Content>("");

  const handleNoteChange = (newContent: Content) => {
    setNoteContent(newContent);
    // If there's any content, set hasNotes to true
    if (newContent && Object.keys(newContent).length > 0) {
      setHasNotes(true);
    }
  };

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
          <div className="mt-4 w-full max-w-2xl">
            <MinimalTiptapEditor
              value={noteContent}
              onChange={handleNoteChange}
              className="min-h-[200px]"
              placeholder="Skriv notatinnholdet her..."
              editable={true}
              autofocus={true}
            />
          </div>
        </EmptyPlaceholder>
      ) : (
        <div className="space-y-4">
          <AddNoteSheet />
          <div className="w-full max-w-2xl">
            <MinimalTiptapEditor
              value={noteContent}
              onChange={handleNoteChange}
              className="min-h-[200px]"
              placeholder="Skriv notatinnholdet her..."
              editable={true}
            />
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
