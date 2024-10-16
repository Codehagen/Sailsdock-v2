"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import Link from "next/link";
import { Company } from "./types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { nFormatter, extractDomain } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
    cell: ({ row }) => {
      const url = row.getValue("url") as string;
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
            <span>Tom</span>
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
