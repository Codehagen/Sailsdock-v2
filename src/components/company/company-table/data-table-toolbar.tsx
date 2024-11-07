"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/company/company-table/data-table-view-options";
import { SaveViewButton } from "@/components/ui/save-view-button";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { companyTypes, companyStatuses, companyPriorities } from "./data";
import { set } from "date-fns";
import { RotateCwSquare } from "lucide-react";
import DataTableEmployeeFilter from "./employee-filter";

const arrRanges = [
  { label: "< 100k", value: "0-100000" },
  { label: "100k - 500k", value: "100000-500000" },
  { label: "500k - 1M", value: "500000-1000000" },
  { label: "> 1M", value: "1000000-" },
];

const last_contacted_options = [
  { label: "Én uke", value: "last-week" },
  { label: "Én måned", value: "last-month" },
  { label: "Tre måneder", value: "last-3-months" },
  { label: "Seks måneder", value: "last-6-months" },
  { label: "Ett år", value: "last-year" },
  { label: "Over ett år", value: "more-than-year" },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data?: any[];
  viewType: "people" | "company";
}

export function DataTableToolbar<TData>({
  table,
  data = [],
  viewType,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const owners =
    viewType === "company" && data.length > 0
      ? data
          .filter((row) => row.account_owners?.length > 0)
          .flatMap((row) => row.account_owners)
          .reduce((uniqueOwners: any[], owner: any) => {
            const ownerName = `${owner?.first_name ?? ""} ${
              owner?.last_name ?? ""
            }`.trim();
            const ownerValue = ownerName.toLowerCase();

            if (!uniqueOwners.some((o) => o.value === ownerValue)) {
              uniqueOwners.push({
                value: ownerValue,
                label: ownerName,
                icon: undefined,
              });
            }

            return uniqueOwners;
          }, [])
      : [];

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        <Input
          placeholder={
            viewType === "people"
              ? "Filtrer personer..."
              : "Filtrer selskaper..."
          }
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {viewType === "company" && (
          <>
            {table.getColumn("account_owners") && (
              <DataTableFacetedFilter
                column={table.getColumn("account_owners")}
                title="Personer"
                options={owners}
              />
            )}
            {table.getColumn("num_employees") && (
              <DataTableEmployeeFilter
                column={table.getColumn("num_employees")}
              />
            )}
            {table.getColumn("user_name") && (
              <DataTableFacetedFilter
                column={table.getColumn("user_name")}
                title="Laget av"
                options={owners}
              />
            )}
            {table.getColumn("last_contacted") && (
              <DataTableFacetedFilter
                column={table.getColumn("last_contacted")}
                title="Sist kontaktet"
                options={last_contacted_options}
              />
            )}
            {table.getColumn("arr") && (
              <DataTableFacetedFilter
                column={table.getColumn("arr")}
                title="ARR"
                options={arrRanges}
              />
            )}
          </>
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
      <div className="flex items-center space-x-2">
        <SaveViewButton parentElement={viewType === "people" ? 2 : 3} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
