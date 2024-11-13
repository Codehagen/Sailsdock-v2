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
import { createPerson } from "@/actions/people/create-person";
import { toast } from "sonner";
import { Loader2, Plus, User, Mail, Phone, BadgeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const personSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  title: z
    .string()
    .optional()
    .transform((val) => (val === undefined || val === null ? "" : val)),
  email: z
    .string()
    .email("Ugyldig e-postadresse")
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return "";
      return val;
    })
    .or(z.literal("")),
  phone: z
    .string()
    .optional()
    .transform((val) => (val === undefined || val === null ? "" : val)),
});

type PersonFormData = z.infer<typeof personSchema>;

const defaultValues: PersonFormData = {
  name: "",
  title: "",
  email: "",
  phone: "",
};

export function AddPersonSheet() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues,
  });

  async function onSubmit(data: PersonFormData) {
    try {
      const result = await createPerson(data);
      if (result) {
        toast.success("Person opprettet", {
          description: `${result.name} er lagt til.`,
        });
        form.reset(defaultValues);
        setIsOpen(false);
        router.push(`/people/${result.uuid}`);
      }
    } catch (error) {
      toast.error("Kunne ikke opprette person", {
        description: "Vennligst sjekk alle feltene og prøv igjen.",
      });
      console.error("Error creating person:", error);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Legg til person
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny person</SheetTitle>
          <SheetDescription>
            Fyll ut informasjonen under for å legge til en ny person.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Skriv inn navn..."
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tittel</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BadgeIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="navn@example.com"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="+47 123 45 678"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
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
                  "Opprett person"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
