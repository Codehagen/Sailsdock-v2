"use client";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddNoteSheet } from "@/components/company/AddNoteSheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useMemo, useCallback } from "react";
import { Content } from "@tiptap/react";
import { NoteCard } from "@/components/company/NoteCard";
import { createNotesCompany } from "@/actions/company/create-notes-companies";
import { updateNotesCompany } from "@/actions/company/update-notes-companies";
import { deleteNotesCompany } from "@/actions/company/delete-notes-companies";
import { toast } from "sonner";

interface Note {
  id: string;
  uuid: string;
  class_type: string;
  date_created: string;
  title: string;
  description: string;
  status: string;
  date: string;
  type: string;
  user: number;
  customer: number;
  deal: number | null;
  companyId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface NotesContentProps {
  notes: Note[];
  companyId: number;
}

export function NotesContent({
  notes: initialNotes,
  companyId,
}: NotesContentProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [noteToEdit, setNoteToEdit] = useState<{
    uuid: string;
    title: string;
    content: Content;
  } | null>(null);

  const sortedNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
  }, [notes]);

  const addNote = useCallback(
    async (newNote: { title: string; content: Content }) => {
      try {
        const createdNote = await createNotesCompany({
          title: newNote.title,
          description: newNote.content?.toString() ?? "",
          customer: companyId,
        });

        if (createdNote) {
          setNotes((prevNotes) => {
            const noteExists = prevNotes.some(
              (note) => note.uuid === (createdNote as Note).uuid
            );
            if (noteExists) return prevNotes;
            return [createdNote as Note, ...prevNotes];
          });
          toast.success("Notat lagt til");
        }
      } catch (error) {
        toast.error("Kunne ikke legge til notat. Vennligst prøv igjen.");
      }
    },
    [companyId]
  );

  const editNote = useCallback(
    async (uuid: string, updatedNote: { title: string; content: Content }) => {
      try {
        const updatedNoteData = await updateNotesCompany(uuid, {
          title: updatedNote.title,
          description: updatedNote.content?.toString() ?? "",
          clientDate: new Date().toISOString(),
        });

        if (updatedNoteData) {
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note.uuid === uuid
                ? {
                    ...note,
                    ...updatedNoteData,
                    date: (updatedNoteData as any).date || note.date,
                  }
                : note
            )
          );
          toast.success("Notat oppdatert");
        }
      } catch (error) {
        toast.error("Kunne ikke oppdatere notat. Vennligst prøv igjen.");
      }
      setNoteToEdit(null);
    },
    []
  );

  const handleEditNote = useCallback(
    (uuid: string) => {
      const noteToEdit = notes.find((note) => note.uuid === uuid);
      if (noteToEdit) {
        setNoteToEdit({
          uuid: noteToEdit.uuid,
          title: noteToEdit.title,
          content: noteToEdit.description as Content,
        });
      }
    },
    [notes]
  );

  const deleteNote = useCallback(async (uuid: string) => {
    try {
      const deleted = await deleteNotesCompany(uuid);
      if (deleted) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.uuid !== uuid));
        toast.success("Notat slettet");
      }
    } catch (error) {
      toast.error("En feil oppstod under sletting av notatet.");
    }
  }, []);

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
            onNoteDeleted={deleteNote}
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
              onNoteDeleted={deleteNote}
              noteToEdit={noteToEdit}
              companyId={companyId}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.uuid}
                id={note.id}
                uuid={note.uuid}
                title={note.title}
                content={note.description}
                companyName="" // You might want to pass this as a prop
                date={note.date} // Changed from createdAt to date
                onEdit={() => handleEditNote(note.uuid)}
              />
            ))}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
