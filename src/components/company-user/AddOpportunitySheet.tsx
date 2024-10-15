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
import { createOpportunity } from "@/actions/opportunity/create-opportunities";
import { toast } from "sonner";
import { OpportunityData } from "@/lib/internal-api/types";

const opportunitySchema = z.object({
  name: z.string().min(1, "Navn på mulighet er påkrevd"),
  value: z.number().min(0, "Verdi må være et positivt tall"),
  probability: z.number().min(0).max(100, "Sannsynlighet må være mellom 0 og 100"),
  expected_close_date: z.string().optional(),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

const defaultValues: OpportunityFormData = {
  name: "",
  value: 0,
  probability: 50,
  expected_close_date: "",
};

interface AddOpportunitySheetProps {
  companyId: string;
  onOpportunityAdded: (opportunity: OpportunityData) => void;
}

export function AddOpportunitySheet({ companyId, onOpportunityAdded }: AddOpportunitySheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues,
  });

  const onSubmit = async (data: OpportunityFormData) => {
    try {
      const result = await createOpportunity({
        ...data,
        company: companyId,
      });
      if (result) {
        toast.success("Mulighet opprettet", {
          description: `${result.name} er lagt til.`,
        });
        onOpportunityAdded(result);
        setIsOpen(false);
        reset(defaultValues);
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
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">Legg til mulighet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny mulighet</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Navn på mulighet</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="value">Verdi (NOK)</Label>
            <Input id="value" type="number" {...register("value", { valueAsNumber: true })} />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="probability">Sannsynlighet (%)</Label>
            <Input id="probability" type="number" {...register("probability", { valueAsNumber: true })} />
            {errors.probability && (
              <p className="text-red-500 text-sm">{errors.probability.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="expected_close_date">Forventet avslutningsdato</Label>
            <Input id="expected_close_date" type="date" {...register("expected_close_date")} />
          </div>
          <Button type="submit">Opprett mulighet</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
