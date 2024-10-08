"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Company } from "./types"; // You'll need to create this type
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Navn" />
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/company/${row.original.uuid}`}
          className="font-medium hover:underline"
        >
          {row.getValue("name")}
        </Link>
      );
    },
  },
  {
    accessorKey: "orgnr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Org.nr" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <Badge>{row.getValue("type")}</Badge>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("status") || "Ikke satt"}</Badge>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioritet" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue("priority") || "Ikke satt"}
      </Badge>
    ),
  },
  {
    accessorKey: "last_contacted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sist kontaktet" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("last_contacted"));
      return date.toLocaleDateString("no-NO");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
