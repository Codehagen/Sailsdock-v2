"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Person } from "./types";
import { DataTableColumnHeader } from "@/components/company/company-table/data-table-column-header";
import { DataTableRowActions } from "@/components/company/company-table/data-table-row-actions";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Navn" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefon" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate">
            {row.getValue("phone") || "Tom"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tittel" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate">
            {row.getValue("title") || "Tom"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selskap" />
    ),
    cell: ({ row }) => {
      const company = row.original.company;
      if (!company || !company.name) {
        return <span className="text-muted-foreground">Tom</span>;
      }
      return (
        <Link href={`/company/${company.uuid}`} className="inline-block">
          <Badge variant="secondary" className="font-normal whitespace-nowrap">
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
      );
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
          <span className="max-w-[500px] truncate">
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
