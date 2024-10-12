"use client";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddNoteSheet } from "@/components/company/AddNoteSheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useMemo } from "react";
import { Content } from "@tiptap/react";
import { NoteCard } from "@/components/company/NoteCard";

interface Note {
  id: number;
  class_type: string;
  uuid: string;
  date_created: string;
  title: string;
  description: string;
  status: string;
  date: string;
  type: string;
  user: number;
  customer: number;
  deal: number | null;
}

interface NotesContentProps {
  notes: Note[];
  companyId: number; // Add this line
}

export function NotesContent({
  notes: initialNotes,
  companyId,
}: NotesContentProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [noteToEdit, setNoteToEdit] = useState<{
    id: number;
    title: string;
    content: Content;
  } | null>(null);

  // Sort notes by date_created, newest first
  const sortedNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
  }, [notes]);

  const addNote = (newNote: { title: string; content: Content }) => {
    const note: Note = {
      id: Math.max(...notes.map((n) => n.id)) + 1,
      class_type: "ContactNote",
      uuid: crypto.randomUUID(),
      date_created: new Date().toISOString(),
      title: newNote.title,
      description: newNote.content?.toString() ?? "",
      status: "completed",
      date: new Date().toISOString(),
      type: "email",
      user: 1, // You might want to get this from the current user
      customer: companyId, // Use the companyId passed as prop
      deal: null,
    };
    setNotes([note, ...notes]);
  };

  const editNote = (
    id: number,
    updatedNote: { title: string; content: Content }
  ) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              title: updatedNote.title,
              description: updatedNote.content?.toString() ?? "",
              date_created: new Date().toISOString(), // Update the date_created when editing
            }
          : note
      )
    );
    setNoteToEdit(null);
  };

  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNoteToEdit({
        id: noteToEdit.id,
        title: noteToEdit.title,
        content: noteToEdit.description as Content,
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
            companyId={companyId}
          />
        </EmptyPlaceholder>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <AddNoteSheet
              onNoteAdded={addNote}
              onNoteEdited={editNote}
              noteToEdit={noteToEdit}
              companyId={companyId}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.description}
                companyName="" // You might want to pass this as a prop
                createdAt={note.date_created}
                onEdit={() => handleEditNote(note.id)}
              />
            ))}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
