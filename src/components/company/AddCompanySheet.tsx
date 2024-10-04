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
import { createCompany } from "@/actions/company/create-companies";
import { toast } from "sonner";

const companySchema = z.object({
  name: z.string().min(1, "Selskapsnavn er påkrevd"),
  orgnr: z.string().min(9, "Organisasjonsnummer må være 9 siffer").max(9),
  address_street: z.string().optional(),
  address_city: z.string().optional(),
  address_zip: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const defaultValues: CompanyFormData = {
  name: "Test AS",
  orgnr: "123456789",
  address_street: "Testveien 1",
  address_city: "Oslo",
  address_zip: "0123",
};

export function AddCompanySheet() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const result = await createCompany(data);
      if (result) {
        toast.success("Selskap opprettet", {
          description: `${result.name} er lagt til.`,
        });
        setIsOpen(false);
        reset(defaultValues);
      } else {
        toast.error("Kunne ikke opprette selskap", {
          description: "Prøv igjen senere.",
        });
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("En uventet feil oppstod", {
        description: "Prøv igjen senere.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Legg til selskap</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til nytt selskap</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Selskapsnavn</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="orgnr">Organisasjonsnummer</Label>
            <Input id="orgnr" {...register("orgnr")} />
            {errors.orgnr && (
              <p className="text-red-500 text-sm">{errors.orgnr.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address_street">Adresse</Label>
            <Input id="address_street" {...register("address_street")} />
          </div>
          <div>
            <Label htmlFor="address_city">By</Label>
            <Input id="address_city" {...register("address_city")} />
          </div>
          <div>
            <Label htmlFor="address_zip">Postnummer</Label>
            <Input id="address_zip" {...register("address_zip")} />
          </div>
          <Button type="submit">Opprett selskap</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
