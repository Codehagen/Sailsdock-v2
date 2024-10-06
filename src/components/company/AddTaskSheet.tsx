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

export function AddTaskSheet() {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const { isDesktop } = useMediaQuery();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically handle the task creation
    console.log("Task created:", { taskName, taskDescription });
    // Reset form fields
    setTaskName("");
    setTaskDescription("");
    setOpen(false);
  };

  const TaskForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="taskName" className="text-right">
            Navn
          </Label>
          <Input
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="taskDescription" className="text-right">
            Beskrivelse
          </Label>
          <Input
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <SheetFooter>
        <Button type="submit">Lagre oppgave</Button>
      </SheetFooter>
    </form>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Legg til oppgave
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Legg til ny oppgave</SheetTitle>
            <SheetDescription>
              Fyll ut detaljene for den nye oppgaven her.
            </SheetDescription>
          </SheetHeader>
          <TaskForm />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Legg til oppgave
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <SheetHeader>
            <SheetTitle>Legg til ny oppgave</SheetTitle>
            <SheetDescription>
              Fyll ut detaljene for den nye oppgaven her.
            </SheetDescription>
          </SheetHeader>
          <TaskForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
