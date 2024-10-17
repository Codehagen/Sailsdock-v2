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
    cell: ({ row, table }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedEmployees, setEditedEmployees] = useState(
        row.getValue("num_employees")?.toString() || ""
      );

      const handleUpdateEmployees = async () => {
        try {
          const updatedCompany = await updateCompany(row.original.uuid, {
            num_employees: parseInt(editedEmployees, 10),
          });
          if (updatedCompany) {
            table.options.meta?.updateData(
              row.index,
              "num_employees",
              updatedCompany.num_employees
            );
            toast.success("Antall ansatte oppdatert");
          } else {
            toast.error("Kunne ikke oppdatere antall ansatte");
          }
        } catch (error) {
          console.error("Error updating number of employees:", error);
          toast.error("En feil oppstod under oppdatering av antall ansatte");
        }
        setIsEditing(false);
      };

      const employeeCount = row.getValue("num_employees");

      return (
        <div className="text-sm text-muted-foreground">
          {employeeCount ? (
            <span>{employeeCount.toString()}</span>
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
                    type="number"
                    value={editedEmployees}
                    onChange={(e) => setEditedEmployees(e.target.value)}
                    placeholder="Skriv inn antall ansatte"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedEmployees("");
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleUpdateEmployees}>
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
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Laget av" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="text-sm text-muted-foreground">
          {user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : "N/A"}
        </div>
      );
    },
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
    cell: ({ row, table }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedArr, setEditedArr] = useState(
        row.getValue("arr")?.toString() || ""
      );

      const handleUpdateArr = async () => {
        try {
          const updatedCompany = await updateCompany(row.original.uuid, {
            arr: parseFloat(editedArr),
          });
          if (updatedCompany) {
            table.options.meta?.updateData(
              row.index,
              "arr",
              updatedCompany.arr
            );
            toast.success("ARR oppdatert");
          } else {
            toast.error("Kunne ikke oppdatere ARR");
          }
        } catch (error) {
          console.error("Error updating ARR:", error);
          toast.error("En feil oppstod under oppdatering av ARR");
        }
        setIsEditing(false);
      };

      const arr = parseFloat(row.getValue("arr"));
      const formatted = arr ? nFormatter(arr, { digits: 1 }) : null;

      return (
        <div className="text-sm text-muted-foreground text-right">
          {formatted ? (
            <span>{formatted}</span>
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
                    type="number"
                    value={editedArr}
                    onChange={(e) => setEditedArr(e.target.value)}
                    placeholder="Skriv inn ARR"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedArr("");
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleUpdateArr}>
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
