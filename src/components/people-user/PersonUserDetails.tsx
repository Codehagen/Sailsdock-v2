"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, Building, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import { updatePerson } from "@/actions/people/update-person";
import { toast } from "sonner";
import { PersonData } from "@/lib/internal-api/types";

interface InfoItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  isLink?: boolean;
  isBadge?: boolean;
  linkPrefix?: string;
  displayValue?: string;
  editable?: boolean;
}

export function PersonUserDetails({
  personDetails,
}: {
  personDetails: PersonData;
}) {
  const [editedName, setEditedName] = useState(personDetails.name);
  const [editedTitle, setEditedTitle] = useState(personDetails.title || "");
  const [editedPhone, setEditedPhone] = useState(personDetails.phone || "");
  const [editedEmail, setEditedEmail] = useState(personDetails.email || "");

  const [isNamePopoverOpen, setIsNamePopoverOpen] = useState(false);
  const [isTitlePopoverOpen, setIsTitlePopoverOpen] = useState(false);
  const [isPhonePopoverOpen, setIsPhonePopoverOpen] = useState(false);
  const [isEmailPopoverOpen, setIsEmailPopoverOpen] = useState(false);

  const handleUpdateField = async (field: string, value: string) => {
    try {
      const updateData = { [field]: value };

      const updatedPerson = await updatePerson(personDetails.uuid, updateData);

      if (updatedPerson) {
        let successMessage = "";
        switch (field) {
          case "name":
            successMessage = "Navn er oppdatert";
            break;
          case "title":
            successMessage = "Tittel er oppdatert";
            break;
          case "email":
            successMessage = "E-postadresse er oppdatert";
            break;
          case "phone":
            successMessage = "Telefonnummer er oppdatert";
            break;
          default:
            successMessage = `${field} er oppdatert`;
        }
        toast.success(successMessage);
        return true;
      } else {
        let errorMessage = "";
        switch (field) {
          case "name":
            errorMessage = "Kunne ikke oppdatere navn";
            break;
          case "title":
            errorMessage = "Kunne ikke oppdatere tittel";
            break;
          case "email":
            errorMessage = "Kunne ikke oppdatere e-postadresse";
            break;
          case "phone":
            errorMessage = "Kunne ikke oppdatere telefonnummer";
            break;
          default:
            errorMessage = `Kunne ikke oppdatere ${field}`;
        }
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      let errorMessage = "";
      switch (field) {
        case "name":
          errorMessage = "En feil oppstod under oppdatering av navn";
          break;
        case "title":
          errorMessage = "En feil oppstod under oppdatering av tittel";
          break;
        case "email":
          errorMessage = "En feil oppstod under oppdatering av e-postadresse";
          break;
        case "phone":
          errorMessage = "En feil oppstod under oppdatering av telefonnummer";
          break;
        default:
          errorMessage = `En feil oppstod under oppdatering av ${field}`;
      }
      toast.error(errorMessage);
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "d. MMMM yyyy", { locale: nb });
  };

  const getTimeAgo = (dateString: string) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  };

  const addedTimeAgo = getTimeAgo(personDetails.date_created);

  const infoItems: InfoItem[] = [
    {
      icon: User,
      label: "Navn",
      value: editedName,
      editable: true,
    },
    {
      icon: Building,
      label: "Tittel",
      value: editedTitle,
      editable: true,
    },
    {
      icon: Mail,
      label: "E-post",
      value: editedEmail,
      editable: true,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: editedPhone,
      editable: true,
    },
    {
      icon: Calendar,
      label: "Opprettet",
      value: formatDate(personDetails.date_created),
      displayValue: getTimeAgo(personDetails.date_created),
    },
    {
      icon: Clock,
      label: "Sist endret",
      value: personDetails.last_modified,
      displayValue: getTimeAgo(personDetails.last_modified),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="/path-to-person-avatar.png"
              alt={personDetails.name}
            />
            <AvatarFallback>
              {personDetails.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold truncate">{editedName}</h3>
            <span className="block text-xs text-muted-foreground mt-1">
              Lagt til {addedTimeAgo}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
                {item.label}:
              </span>
              {item.editable ? (
                <Popover
                  open={
                    item.label === "Navn"
                      ? isNamePopoverOpen
                      : item.label === "Tittel"
                      ? isTitlePopoverOpen
                      : item.label === "Telefon"
                      ? isPhonePopoverOpen
                      : isEmailPopoverOpen
                  }
                  onOpenChange={
                    item.label === "Navn"
                      ? setIsNamePopoverOpen
                      : item.label === "Tittel"
                      ? setIsTitlePopoverOpen
                      : item.label === "Telefon"
                      ? setIsPhonePopoverOpen
                      : setIsEmailPopoverOpen
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-normal text-left"
                    >
                      <span className="text-sm text-muted-foreground">
                        {item.value || "Ikke angitt"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <Input
                        value={
                          item.label === "Navn"
                            ? editedName
                            : item.label === "Tittel"
                            ? editedTitle
                            : item.label === "Telefon"
                            ? editedPhone
                            : editedEmail
                        }
                        onChange={(e) =>
                          item.label === "Navn"
                            ? setEditedName(e.target.value)
                            : item.label === "Tittel"
                            ? setEditedTitle(e.target.value)
                            : item.label === "Telefon"
                            ? setEditedPhone(e.target.value)
                            : setEditedEmail(e.target.value)
                        }
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (item.label === "Navn")
                              setEditedName(personDetails.name);
                            else if (item.label === "Tittel")
                              setEditedTitle(personDetails.title || "");
                            else if (item.label === "Telefon")
                              setEditedPhone(personDetails.phone || "");
                            else setEditedEmail(personDetails.email || "");

                            if (item.label === "Navn")
                              setIsNamePopoverOpen(false);
                            else if (item.label === "Tittel")
                              setIsTitlePopoverOpen(false);
                            else if (item.label === "Telefon")
                              setIsPhonePopoverOpen(false);
                            else setIsEmailPopoverOpen(false);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Avbryt
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            const field =
                              item.label === "Navn"
                                ? "name"
                                : item.label === "Tittel"
                                ? "title"
                                : item.label === "Telefon"
                                ? "phone"
                                : "email";
                            const value =
                              item.label === "Navn"
                                ? editedName
                                : item.label === "Tittel"
                                ? editedTitle
                                : item.label === "Telefon"
                                ? editedPhone
                                : editedEmail;
                            const success = await handleUpdateField(
                              field,
                              value
                            );
                            if (success) {
                              if (item.label === "Navn")
                                setIsNamePopoverOpen(false);
                              else if (item.label === "Tittel")
                                setIsTitlePopoverOpen(false);
                              else if (item.label === "Telefon")
                                setIsPhonePopoverOpen(false);
                              else setIsEmailPopoverOpen(false);
                            }
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Bekreft
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {item.displayValue || item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
