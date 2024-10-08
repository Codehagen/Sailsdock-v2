"use client";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddNoteSheet } from "@/components/company/AddNoteSheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Content } from "@tiptap/react";
import { NoteCard } from "@/components/company/NoteCard";

interface NotesContentProps {
  hasNotes?: boolean;
}

// Mock data for testing
const mockNotes = [
  {
    id: "1",
    title: "Important Meeting Notes",
    description: "Discussed Q4 targets and strategies for the upcoming year.",
    companyName: "Acme Corp",
  },
  {
    id: "2",
    title: "Product Launch Plan",
    description: "Outlined key milestones for the new product launch in Q2.",
    companyName: "TechStart Inc",
  },
  {
    id: "3",
    title: "Client Feedback",
    description: "Positive feedback received on the latest project delivery.",
    companyName: "Global Services Ltd",
  },
  {
    id: "4",
    title: "Team Performance Review",
    description: "Quarterly performance review for the development team.",
    companyName: "DevOps Solutions",
  },
];

export function NotesContent({ hasNotes = true }: NotesContentProps) {
  const [noteContent, setNoteContent] = useState<Content>("");

  const handleNoteChange = (newContent: Content) => {
    setNoteContent(newContent);
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
        </EmptyPlaceholder>
      ) : (
        <div className="space-y-6">
          <AddNoteSheet />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockNotes.map((note) => (
              <NoteCard
                key={note.id}
                title={note.title}
                description={note.description}
                companyName={note.companyName}
              />
            ))}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
