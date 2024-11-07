"use client";

import React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/company/company-table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/company/company-table/data-table-faceted-filter";
import { Task } from "./types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data: Task[];
}

const deadline_options = [
  { label: "Forfalt", value: "overdue" },
  { label: "I dag", value: "today" },
  { label: "Denne uken", value: "this-week" },
  { label: "Neste uke", value: "next-week" },
  { label: "Denne måneden", value: "this-month" },
  { label: "Senere", value: "later" },
];

export function DataTableToolbar<TData>({
  table,
  data = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Get unique list of users from tasks
  const users = (data || [])
    .filter((row) => row.user_details)
    .reduce((uniqueUsers: any[], row: any) => {
      const user = row.user_details;
      const userName = `${user?.first_name ?? ""} ${
        user?.last_name ?? ""
      }`.trim();
      const userValue = userName.toLowerCase();

      if (!uniqueUsers.some((u) => u.value === userValue)) {
        uniqueUsers.push({
          value: userValue,
          label: userName || user.email,
          icon: undefined,
        });
      }

      return uniqueUsers;
    }, []);

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        <Input
          placeholder="Filtrer oppgaver..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { label: "Å gjøre", value: "todo" },
              { label: "Pågår", value: "in_progress" },
              { label: "Ferdig", value: "done" },
            ]}
          />
        )}
        {table.getColumn("date") && (
          <DataTableFacetedFilter
            column={table.getColumn("date")}
            title="Frist"
            options={deadline_options}
          />
        )}
        {table.getColumn("user_details") && (
          <DataTableFacetedFilter
            column={table.getColumn("user_details")}
            title="Ansvarlig"
            options={users}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Tilbakestill
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
