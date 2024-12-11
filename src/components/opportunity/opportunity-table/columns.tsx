"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/company/company-table/data-table-column-header";
import { DataTableRowActions } from "@/components/company/company-table/data-table-row-actions";
import Link from "next/link";
import { Opportunity } from "./types";
import { Badge } from "@/components/ui/badge";
import { nFormatter } from "@/lib/utils";

export const columns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Navn" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          <Link
            href={`/opportunities/${row.original.uuid}`}
            className="font-medium hover:underline"
          >
            {row.getValue("name")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stadium" />
    ),
    cell: ({ row }) => {
      const stage = row.getValue("stage");
      console.log("Stage value:", stage);
      return (
        <div className="text-sm">
          <Badge variant="secondary">{stage}</Badge>
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      const stage = row.getValue(id) as string;
      console.log("Filtering stage:", { stage, filterValue });
      return filterValue.includes(stage);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          <Badge variant="outline">{row.getValue("status")}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verdi" />
    ),
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      const formatted = value ? nFormatter(value, { digits: 1 }) : "0";
      return <div className="text-sm text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "companies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selskaper" />
    ),
    cell: ({ row }) => {
      const companies = row.getValue("companies") as Opportunity["companies"];
      return (
        <div className="flex gap-1">
          {companies.length > 0 ? (
            companies.map((company) => (
              <Link key={company.id} href={`/company/${company.uuid}`}>
                <Badge variant="secondary" className="font-normal">
                  {company.name}
                </Badge>
              </Link>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              Ingen selskaper
            </span>
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
