"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Person } from "./types";
import { DataTableColumnHeader } from "@/components/company/company-table/data-table-column-header";
import { DataTableRowActions } from "@/components/company/company-table/data-table-row-actions";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import { Building2 } from "lucide-react";

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Navn" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link
            href={`/people/${row.original.uuid}`}
            className="max-w-[500px] truncate font-medium hover:underline"
          >
            {row.getValue("name")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefon" />
    ),
    cell: ({ row, table }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedPhone, setEditedPhone] = useState(
        row.getValue("phone") as string
      );

      const handleUpdatePhone = async () => {
        try {
          const updatedPerson = await updatePerson(row.original.uuid, {
            phone: editedPhone,
          });
          if (updatedPerson) {
            table.options.meta?.updateData(
              row.index,
              "phone",
              updatedPerson.phone
            );
            toast.success("Telefonnummer oppdatert");
          } else {
            toast.error("Kunne ikke oppdatere telefonnummer");
          }
        } catch (error) {
          console.error("Error updating phone number:", error);
          toast.error("En feil oppstod under oppdatering av telefonnummer");
        }
        setIsEditing(false);
      };

      return (
        <div className="flex space-x-2">
          {row.getValue("phone") ? (
            <span className="max-w-[500px] truncate text-muted-foreground">
              {row.getValue("phone")}
            </span>
          ) : (
            <Popover open={isEditing} onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 p-0 font-normal">
                  <span className="text-sm text-muted-foreground">Tom</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Input
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    placeholder="Skriv inn telefonnummer"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedPhone(row.getValue("phone") as string);
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleUpdatePhone}>
                      <Check className="h-4 w-4 mr-1" />
                      Bekreft
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-post" />
    ),
    cell: ({ row, table }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedEmail, setEditedEmail] = useState(
        row.getValue("email") as string
      );

      const handleUpdateEmail = async () => {
        try {
          const updatedPerson = await updatePerson(row.original.uuid, {
            email: editedEmail,
          });
          if (updatedPerson) {
            table.options.meta?.updateData(
              row.index,
              "email",
              updatedPerson.email
            );
            toast.success("E-post oppdatert");
          } else {
            toast.error("Kunne ikke oppdatere e-post");
          }
        } catch (error) {
          console.error("Error updating email:", error);
          toast.error("En feil oppstod under oppdatering av e-post");
        }
        setIsEditing(false);
      };

      return (
        <div className="flex space-x-2">
          {row.getValue("email") ? (
            <span className="max-w-[500px] truncate text-muted-foreground">
              {row.getValue("email")}
            </span>
          ) : (
            <Popover open={isEditing} onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 p-0 font-normal">
                  <span className="text-sm text-muted-foreground">Tom</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Skriv inn e-post"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedEmail(row.getValue("email") as string);
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleUpdateEmail}>
                      <Check className="h-4 w-4 mr-1" />
                      Bekreft
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tittel" />
    ),
    cell: ({ row, table }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedTitle, setEditedTitle] = useState(
        row.getValue("title") as string
      );

      const handleUpdateTitle = async () => {
        try {
          const updatedPerson = await updatePerson(row.original.uuid, {
            title: editedTitle,
          });
          if (updatedPerson) {
            table.options.meta?.updateData(
              row.index,
              "title",
              updatedPerson.title
            );
            toast.success("Tittel oppdatert");
          } else {
            toast.error("Kunne ikke oppdatere tittel");
          }
        } catch (error) {
          console.error("Error updating title:", error);
          toast.error("En feil oppstod under oppdatering av tittel");
        }
        setIsEditing(false);
      };

      return (
        <div className="flex space-x-2">
          {row.getValue("title") ? (
            <span className="max-w-[500px] truncate text-muted-foreground">
              {row.getValue("title")}
            </span>
          ) : (
            <Popover open={isEditing} onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 p-0 font-normal">
                  <span className="text-sm text-muted-foreground">Tom</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Skriv inn tittel"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedTitle(row.getValue("title") as string);
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleUpdateTitle}>
                      <Check className="h-4 w-4 mr-1" />
                      Bekreft
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
    filterFn: (row: any, columnId: string, filterValue: string[]) => {
      if (!filterValue?.length) return true

      return filterValue.some((filter) => filter === row.original.title.toLowerCase());
    },
  },
  {
    accessorKey: "companies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selskaper" />
    ),
    cell: ({ row }) => {
      const companies = row.original.companies;

      if (!companies || companies.length === 0) {
        return (
          <span className="flex items-center gap-2 text-muted-foreground text-sm">
            <Building2 className="h-4 w-4" />
            <span>Ingen tilknyttet selskap</span>
          </span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1">
          {companies.map((company) => (
            <Link
              key={company.uuid}
              href={`/company/${company.uuid}`}
              className="inline-block"
            >
              <Badge
                variant="secondary"
                className="font-normal whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <div
                    className={cn(
                      "flex items-center justify-center",
                      "w-4 h-4 rounded-full bg-orange-100 text-orange-500",
                      "text-[10px] font-medium"
                    )}
                  >
                    {company.name.charAt(0)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {company.name}
                  </span>
                </div>
              </Badge>
            </Link>
          ))}
        </div>
      );
    },
    filterFn: (row: any, columnId: string, filterValue: string[]) => {
      if (!filterValue?.length) return true

      return filterValue.some((filter) => row.original.companies.some((company: any) => company.name.toLowerCase() === filter));
    },
  },
  {
    accessorKey: "last_modified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sist endret" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("last_modified");
      if (!date) return <span className="text-muted-foreground">Tom</span>;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate text-muted-foreground">
            {formatDistanceToNow(parseISO(date as string), {
              addSuffix: true,
              locale: nb,
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
