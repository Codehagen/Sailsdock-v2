"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
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

export function AddNoteSheet() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState<Content>("");
  const { isDesktop } = useMediaQuery();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically handle the note creation
    console.log("Note created:", { noteTitle, noteContent });
    // Reset form fields
    setNoteTitle("");
    setNoteContent("");
    setOpen(false);
  };

  const NoteForm = () => (
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
          onChange={setNoteContent}
          className="min-h-[200px]"
          placeholder="Skriv notatinnholdet her..."
          editable={true}
          autofocus={true}
        />
      </div>
      <SheetFooter>
        <Button type="submit">Lagre notat</Button>
      </SheetFooter>
    </form>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Legg til notat
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Legg til nytt notat</SheetTitle>
            <SheetDescription>
              Fyll ut detaljene for det nye notatet her.
            </SheetDescription>
          </SheetHeader>
          <NoteForm />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Legg til notat
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <SheetHeader>
            <SheetTitle>Legg til nytt notat</SheetTitle>
            <SheetDescription>
              Fyll ut detaljene for det nye notatet her.
            </SheetDescription>
          </SheetHeader>
          <NoteForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
