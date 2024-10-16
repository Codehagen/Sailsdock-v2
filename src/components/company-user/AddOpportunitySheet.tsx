"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createOpportunity } from "@/actions/opportunity/create-opportunities";
import { OpportunityData } from "@/lib/internal-api/types";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(1, "Navn på mulighet er påkrevd"),
  value: z.coerce.number().min(0, "Verdi må være et positivt tall"),
  probability: z.coerce
    .number()
    .min(0)
    .max(100, "Sannsynlighet må være mellom 0 og 100"),
  expected_close_date: z.string().optional(),
});

interface AddOpportunitySheetProps {
  companyId: number;
  onOpportunityAdded: (opportunity: OpportunityData) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AddOpportunitySheet({
  companyId,
  onOpportunityAdded,
  isOpen,
  setIsOpen,
}: AddOpportunitySheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: 0,
      probability: 50,
      expected_close_date: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createOpportunity({
        ...values,
        company: companyId,
      });
      if (result) {
        toast.success("Mulighet opprettet", {
          description: `${result.name} er lagt til.`,
        });
        onOpportunityAdded(result);
        setIsOpen(false);
        form.reset();
      } else {
        toast.error("Kunne ikke opprette mulighet", {
          description: "Prøv igjen senere.",
        });
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast.error("En uventet feil oppstod", {
        description: "Prøv igjen senere.",
      });
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny mulighet</SheetTitle>
          <SheetDescription>
            Fyll ut skjemaet for å legge til en ny mulighet.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn på mulighet</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verdi (NOK)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="probability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sannsynlighet (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expected_close_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forventet avslutningsdato</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Opprett mulighet</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
