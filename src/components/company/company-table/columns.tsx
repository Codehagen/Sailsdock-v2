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
import { cn } from "@/lib/utils";

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
    accessorKey: "account_owners",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personer" />
    ),
    cell: ({ row }) => {
      const accountOwners = row.original.account_owners || [];
      return (
        <div className="max-w-[200px] overflow-x-auto">
          <div className="flex gap-1 py-1">
            {accountOwners.map((owner) => (
              <Link
                key={owner.id}
                href={`/people/${owner.clerk_id}`}
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
                      {owner.first_name?.charAt(0) || owner.email.charAt(0)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {`${owner.first_name || ""} ${owner.last_name || ""}`}
                    </span>
                  </div>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "num_employees",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ansatte" />
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
        {row.original.user.first_name} {row.original.user.last_name}
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
