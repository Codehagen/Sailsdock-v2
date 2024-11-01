"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Loader2, Plus, Trash2 } from "lucide-react";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { MinimalTiptapEditor } from "@/components/notes/minimal-tiptap/minimal-tiptap";
import { Content } from "@tiptap/react";
import { createNotesCompany } from "@/actions/company/create-notes-companies";
import { toast } from "sonner";

const MemoizedMinimalTiptapEditor = React.memo(MinimalTiptapEditor);

interface NoteFormProps {
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  noteContent: Content;
  setNoteContent: (content: Content) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const NoteForm = React.memo(
  ({
    noteTitle,
    setNoteTitle,
    noteContent,
    setNoteContent,
    onSubmit,
  }: NoteFormProps) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="noteTitle">Tittel</Label>
        <Input
          id="noteTitle"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="noteContent">Innhold</Label>
        <MemoizedMinimalTiptapEditor
          value={noteContent}
          onChange={setNoteContent}
          className="min-h-[200px]"
          placeholder="Skriv notatinnholdet her..."
          editable={true}
          autofocus={false}
        />
      </div>
      <SheetFooter>
        <Button type="submit">Lagre notat</Button>
      </SheetFooter>
    </form>
  )
);

NoteForm.displayName = "NoteForm";

interface AddNoteSheetProps {
  onNoteAdded: (note: { title: string; content: Content }) => void;
  onNoteEdited: (
    uuid: string,
    note: { title: string; content: Content }
  ) => void;
  onNoteDeleted: (uuid: string) => void;
  noteToEdit?: { uuid: string; title: string; content: Content } | null;
  companyId: number;
}

export function AddNoteSheet({
  onNoteAdded,
  onNoteEdited,
  onNoteDeleted,
  noteToEdit,
  companyId,
}: AddNoteSheetProps) {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState(noteToEdit?.title || "");
  const [noteContent, setNoteContent] = useState<Content>(
    noteToEdit?.content || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isDesktop } = useMediaQuery();

  useEffect(() => {
    if (noteToEdit) {
      setNoteTitle(noteToEdit.title);
      setNoteContent(noteToEdit.content);
      setOpen(true);
    }
  }, [noteToEdit]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (isSaving) return;
      setIsSaving(true);
      try {
        if (noteToEdit) {
          await onNoteEdited(noteToEdit.uuid, {
            title: noteTitle,
            content: noteContent,
          });
        } else {
          onNoteAdded({ title: noteTitle, content: noteContent });
        }
        setNoteTitle("");
        setNoteContent("");
        setOpen(false);
      } catch (error) {
        toast.error("Kunne ikke lagre notat. Vennligst prøv igjen.");
      } finally {
        setIsSaving(false);
      }
    },
    [noteTitle, noteContent, onNoteAdded, onNoteEdited, noteToEdit, isSaving]
  );

  const handleDelete = useCallback(async () => {
    if (noteToEdit && !isDeleting) {
      setIsDeleting(true);
      try {
        await onNoteDeleted(noteToEdit.uuid);
        setOpen(false);
      } catch (error) {
        toast.error("En feil oppstod under sletting av notatet.");
      } finally {
        setIsDeleting(false);
      }
    }
  }, [noteToEdit, onNoteDeleted, isDeleting]);

  const handleNoteContentChange = useCallback((newContent: Content) => {
    setNoteContent(newContent);
  }, []);

  const triggerButton = (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Legg til notat
    </Button>
  );

  const sheetContent = (
    <>
      <SheetHeader>
        <SheetTitle>
          {noteToEdit ? "Rediger notat" : "Legg til nytt notat"}
        </SheetTitle>
        <SheetDescription>
          {noteToEdit
            ? "Rediger detaljene for notatet her."
            : "Fyll ut detaljene for det nye notatet her."}
        </SheetDescription>
      </SheetHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="noteTitle">Tittel</Label>
          <Input
            id="noteTitle"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="noteContent">Innhold</Label>
          <MinimalTiptapEditor
            value={noteContent}
            onChange={handleNoteContentChange}
            className="min-h-[200px]"
            placeholder="Skriv notatinnholdet her..."
            editable={true}
            autofocus={false}
          />
        </div>
        <SheetFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Lagrer...
              </>
            ) : (
              "Lagre notat"
            )}
          </Button>
        </SheetFooter>
      </form>
      {noteToEdit && (
        <SheetFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-4"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sletter...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Slett notat
              </>
            )}
          </Button>
        </SheetFooter>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent className="sm:max-w-[600px]">{sheetContent}</SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">{sheetContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
