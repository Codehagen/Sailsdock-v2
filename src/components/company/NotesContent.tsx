"use client";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddNoteSheet } from "@/components/company/AddNoteSheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useMemo } from "react";
import { Content } from "@tiptap/react";
import { NoteCard } from "@/components/company/NoteCard";

interface NotesContentProps {
  hasNotes?: boolean;
}

// Updated mock data to reflect AddNoteSheet output
const mockNotes = [
  {
    id: "1",
    title: "Viktige møtenotater",
    content:
      "<p>Diskuterte Q4-mål og strategier for det kommende året.</p><ul><li>Øke salget med 15%</li><li>Lansere ny produktlinje</li></ul>",
    companyName: "Acme Corp",
    createdAt: "2024-05-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Produktlanseringsplan",
    content:
      "<p>Skisserte viktige milepæler for den nye produktlanseringen i Q2:</p><ol><li>Ferdigstille design innen 15. april</li><li>Starte produksjon innen 1. mai</li><li>Starte markedsføringskampanje 1. juni</li></ol>",
    companyName: "TechStart Inc",
    createdAt: "2024-06-20T14:45:00Z",
  },
  {
    id: "3",
    title: "Kundetilbakemelding",
    content:
      "<p>Positiv tilbakemelding mottatt på den siste prosjektleveransen:</p><blockquote>Teamet overgikk våre forventninger. Flott jobb!</blockquote>",
    companyName: "Global Services Ltd",
    createdAt: "2024-08-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Teamets ytelsesgjennomgang",
    content:
      "<p>Kvartalsvis ytelsesgjennomgang for utviklingsteamet:</p><ul><li>Forbedret kodekvalitet med 20%</li><li>Reduserte antall feil med 30%</li><li>Økte testdekning til 85%</li></ul>",
    companyName: "DevOps Solutions",
    createdAt: "2024-10-08T16:00:00Z",
  },
];

export function NotesContent({ hasNotes = true }: NotesContentProps) {
  const [notes, setNotes] = useState(mockNotes);
  const [noteToEdit, setNoteToEdit] = useState<{
    id: string;
    title: string;
    content: Content;
  } | null>(null);

  // Sort notes by createdAt date, newest first
  const sortedNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notes]);

  const addNote = (newNote: { title: string; content: Content }) => {
    const note = {
      id: (notes.length + 1).toString(),
      title: newNote.title,
      content: newNote.content?.toString() ?? "", // Safely convert Content to string, default to empty string if null
      companyName: "Current Company", // You might want to pass this as a prop
      createdAt: new Date().toISOString(),
    };
    setNotes([note, ...notes]);
  };

  const editNote = (
    id: string,
    updatedNote: { title: string; content: Content }
  ) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              title: updatedNote.title,
              content: updatedNote.content?.toString() ?? "",
              createdAt: new Date().toISOString(), // Update the createdAt date when editing
            }
          : note
      )
    );
    setNoteToEdit(null);
  };

  const handleEditNote = (id: string) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNoteToEdit({
        id: noteToEdit.id,
        title: noteToEdit.title,
        content: noteToEdit.content as Content,
      });
    }
  };

  return (
    <TooltipProvider>
      {sortedNotes.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="file" />
          <EmptyPlaceholder.Title>Ingen notater</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Begynn å legge til notater for dette selskapet.
          </EmptyPlaceholder.Description>
          <AddNoteSheet
            onNoteAdded={addNote}
            onNoteEdited={editNote}
            noteToEdit={noteToEdit}
          />
        </EmptyPlaceholder>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <AddNoteSheet
              onNoteAdded={addNote}
              onNoteEdited={editNote}
              noteToEdit={noteToEdit}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                companyName={note.companyName}
                createdAt={note.createdAt}
                onEdit={handleEditNote}
              />
            ))}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
