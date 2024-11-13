"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTask } from "@/actions/tasks/create-task";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Loader2,
  Plus,
  CalendarIcon,
  ListTodo,
  FileText,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";

const taskSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd"),
  description: z.string().optional().default(""),
  date: z.date({
    required_error: "Velg en dato",
  }),
  status: z.string().min(1, "Status er påkrevd"),
  type: z.string().min(1, "Type er påkrevd"),
});

type TaskFormData = z.infer<typeof taskSchema>;

const defaultValues: TaskFormData = {
  title: "",
  description: "",
  date: new Date(),
  status: "todo",
  type: "general",
};

export function AddTaskSheet() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  async function onSubmit(data: TaskFormData) {
    try {
      const result = await createTask(data);
      if (result) {
        toast.success("Oppgave opprettet", {
          description: `${result.title} er lagt til.`,
        });
        form.reset(defaultValues);
        setIsOpen(false);
        router.push(`/tasks/${result.uuid}`);
      }
    } catch (error) {
      toast.error("Kunne ikke opprette oppgave", {
        description: "Vennligst sjekk alle feltene og prøv igjen.",
      });
      console.error("Error creating task:", error);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Legg til oppgave
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny oppgave</SheetTitle>
          <SheetDescription>
            Fyll ut informasjonen under for å legge til en ny oppgave.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tittel</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ListTodo className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Skriv inn tittel..."
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beskrivelse</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        placeholder="Skriv inn beskrivelse..."
                        className="pl-8 min-h-[100px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Frist</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: nb })
                          ) : (
                            <span>Velg en dato</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <div className="relative">
                        <AlertCircle className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SelectTrigger className="pl-8">
                          <SelectValue placeholder="Velg status" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SelectTrigger className="pl-8">
                          <SelectValue placeholder="Velg type" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">Generell</SelectItem>
                      <SelectItem value="meeting">Møte</SelectItem>
                      <SelectItem value="followup">Oppfølging</SelectItem>
                      <SelectItem value="document">Dokument</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  "Opprett oppgave"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
