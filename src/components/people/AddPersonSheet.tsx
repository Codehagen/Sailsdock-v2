"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPerson } from "@/actions/people/create-person";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const personSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  title: z.string().optional(),
  email: z.string().email("Ugyldig e-postadresse").optional().or(z.literal("")),
  phone: z.string().optional(),
});

type PersonFormData = z.infer<typeof personSchema>;

const defaultValues: PersonFormData = {
  name: "",
  title: "",
  email: "",
  phone: "",
};

export function AddPersonSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues,
  });

  const onSubmit = async (data: PersonFormData) => {
    setIsLoading(true);
    try {
      const result = await createPerson(data);
      if (result) {
        toast.success("Person opprettet", {
          description: `${result.name} er lagt til.`,
        });
        setIsOpen(false);
        reset(defaultValues);
      } else {
        toast.error("Kunne ikke opprette person", {
          description: "Vennligst sjekk alle feltene og prøv igjen.",
        });
      }
    } catch (error: any) {
      console.error("Error creating person:", error);
      toast.error("En uventet feil oppstod", {
        description: error.message || "Vennligst prøv igjen senere.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Legg til person</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny person</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Navn</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="title">Tittel</Label>
            <Input id="title" {...register("title")} />
          </div>
          <div>
            <Label htmlFor="email">E-post</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vennligst vent
              </>
            ) : (
              "Opprett person"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
