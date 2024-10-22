"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendFeedback } from "@/actions/misc/send-feedback";
import { getCurrentUser } from "@/actions/user/get-user-data";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Navnet må være minst 2 tegn.",
  }),
  email: z.string().email({
    message: "Vennligst skriv inn en gyldig e-postadresse.",
  }),
  feedback: z.string().min(10, {
    message: "Tilbakemeldingen må være minst 10 tegn.",
  }),
});

interface FeedbackDialogProps {
  children: React.ReactNode;
}

export function FeedbackDialog({ children }: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      feedback: "",
    },
  });

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      const userData = await getCurrentUser();
      if (userData) {
        form.setValue(
          "name",
          `${userData.first_name} ${userData.last_name}`.trim()
        );
        form.setValue("email", userData.email);
      }
      setIsLoading(false);
    }

    if (isOpen) {
      loadUserData();
    }
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await sendFeedback(formData);

    if (result.success) {
      form.reset();
      setIsOpen(false);
      toast.success("Tilbakemelding sendt", {
        description:
          "Takk for din tilbakemelding! Den har blitt sendt til Sailsdock.",
      });
    } else {
      toast.error(
        "Kunne ikke sende tilbakemelding. Vennligst prøv igjen senere."
      );
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send tilbakemelding</DialogTitle>
          <DialogDescription>
            Send din tilbakemelding direkte til Sailsdock. Vi vil svare så snart
            som mulig.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder={isLoading ? "Henter navn..." : "Ditt navn"}
                    />
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
                    <Input
                      {...field}
                      type="email"
                      disabled={isLoading}
                      placeholder={
                        isLoading ? "Henter e-post..." : "Din e-postadresse"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tilbakemelding</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isLoading}
                      placeholder="Skriv din tilbakemelding her..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sender...
                  </>
                ) : (
                  "Send tilbakemelding"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
