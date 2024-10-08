"use client";

import React, { useState, useCallback } from "react";
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
import { Plus } from "lucide-react";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { MinimalTiptapEditor } from "@/components/notes/minimal-tiptap/minimal-tiptap";
import { Content } from "@tiptap/react";

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

export function AddNoteSheet() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState<Content>("");
  const { isDesktop } = useMediaQuery();

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      console.log("Note created:", { noteTitle, noteContent });
      setNoteTitle("");
      setNoteContent("");
      setOpen(false);
    },
    [noteTitle, noteContent]
  );

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
        <SheetTitle>Legg til nytt notat</SheetTitle>
        <SheetDescription>
          Fyll ut detaljene for det nye notatet her.
        </SheetDescription>
      </SheetHeader>
      <NoteForm
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        noteContent={noteContent}
        setNoteContent={handleNoteContentChange}
        onSubmit={handleSubmit}
      />
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
