"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import Link from "next/link";
import { Company } from "./types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { nFormatter, extractDomain } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X, Pen } from "lucide-react";
import { updateCompany } from "@/actions/company/update-companies";
import { toast } from "sonner";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Navn" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          <Link
            href={`/company/${row.original.uuid}`}
            className="font-medium hover:underline"
          >
            {row.getValue("name")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "orgnr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Org.nr" />
    ),
    cell: ({ row }) => {
      const orgnr = row.getValue("orgnr") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {orgnr ? (
            <Link
              href={`https://www.proff.no/bransjesøk?q=${orgnr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {orgnr}
            </Link>
          ) : (
            "N/A"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row, table }) => {
      const [url, setUrl] = useState(row.getValue("url") as string);
      const [isEditing, setIsEditing] = useState(false);
      const [editedUrl, setEditedUrl] = useState(url);

      const handleUpdateUrl = async () => {
        try {
          const updatedCompany = await updateCompany(row.original.uuid, {
            url: editedUrl,
          });
          if (updatedCompany) {
            setUrl(updatedCompany.url);
            toast.success("URL oppdatert");
            table.options.meta?.updateData(
              row.index,
              "url",
              updatedCompany.url
            );
          } else {
            toast.error("Kunne ikke oppdatere URL");
          }
        } catch (error) {
          console.error("Error updating URL:", error);
          toast.error("En feil oppstod under oppdatering av URL");
        }
        setIsEditing(false);
      };

      const domain = url ? extractDomain(url) : "Tom";

      return (
        <div className="text-sm text-muted-foreground">
          {url ? (
            <Badge variant="secondary" className="font-normal">
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline text-muted-foreground"
              >
                {domain}
              </Link>
            </Badge>
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
                    value={editedUrl}
                    onChange={(e) => setEditedUrl(e.target.value)}
                    placeholder="Skriv inn URL"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedUrl(url);
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleUpdateUrl}>
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
    accessorKey: "num_employees",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personer" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("num_employees") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Laget av" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("user_name")}
      </div>
    ),
  },
  {
    accessorKey: "last_contacted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sist kontaktet" />
    ),
    cell: ({ row }) => {
      const date = parseISO(row.getValue("last_contacted"));
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true, locale: nb })}
        </div>
      );
    },
  },
  {
    accessorKey: "arr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ARR" />
    ),
    cell: ({ row }) => {
      const arr = parseFloat(row.getValue("arr"));
      const formatted = nFormatter(arr, { digits: 1 });
      return (
        <div className="text-sm text-muted-foreground text-right">
          {formatted}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
