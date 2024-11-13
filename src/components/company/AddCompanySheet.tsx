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
import { createCompany } from "@/actions/company/create-companies";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Building2,
  Hash,
  MapPin,
  Home,
  Mail,
} from "lucide-react";

const companySchema = z.object({
  name: z.string().min(1, "Selskapsnavn er påkrevd"),
  orgnr: z
    .string()
    .min(9, "Organisasjonsnummer må være 9 siffer")
    .max(9, "Organisasjonsnummer må være 9 siffer"),
  address_street: z
    .string()
    .optional()
    .transform((val) => (val === undefined || val === null ? "" : val)),
  address_city: z
    .string()
    .optional()
    .transform((val) => (val === undefined || val === null ? "" : val)),
  address_zip: z
    .string()
    .optional()
    .transform((val) => (val === undefined || val === null ? "" : val)),
});

type CompanyFormData = z.infer<typeof companySchema>;

const defaultValues: CompanyFormData = {
  name: "",
  orgnr: "",
  address_street: "",
  address_city: "",
  address_zip: "",
};

export function AddCompanySheet() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  async function onSubmit(data: CompanyFormData) {
    try {
      const result = await createCompany(data);
      if (result) {
        toast.success("Selskap opprettet", {
          description: `${result.name} er lagt til.`,
        });
        form.reset(defaultValues);
        setIsOpen(false);
        router.push(`/company/${result.uuid}`);
      }
    } catch (error) {
      toast.error("Kunne ikke opprette selskap", {
        description: "Vennligst sjekk alle feltene og prøv igjen.",
      });
      console.error("Error creating company:", error);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Legg til selskap
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til nytt selskap</SheetTitle>
          <SheetDescription>
            Fyll ut informasjonen under for å legge til et nytt selskap.
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
                  <FormLabel>Selskapsnavn</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Skriv inn selskapsnavn..."
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
              name="orgnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisasjonsnummer</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="123456789"
                        className="pl-8"
                        maxLength={9}
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
              name="address_street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateadresse</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Skriv inn gateadresse..."
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
              name="address_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>By</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Skriv inn by..."
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
              name="address_zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postnummer</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="0000"
                        className="pl-8"
                        maxLength={4}
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
                  "Opprett selskap"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
