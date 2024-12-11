"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/company/company-table/data-table-view-options";
import { SaveViewButton } from "@/components/ui/save-view-button";

import { DataTableFacetedFilter } from "@/components/company/company-table/data-table-faceted-filter";
import { usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

// Define filter options
const stageOptions = [
  { label: "Ikke startet", value: "ikke-startet" },
  { label: "Følge opp", value: "folge-opp" },
  { label: "Forhandling", value: "forhandling" },
  { label: "Vunnet", value: "vunnet" },
  { label: "Tapt", value: "tapt" },
];

const statusOptions = [
  { label: "Venter på bruker", value: "venter-pa-bruker" },
  { label: "I prosess", value: "i-prosess" },
  { label: "Fullført", value: "fullfort" },
];

const valueRanges = [
  { label: "< 10k", value: "0-10000" },
  { label: "10k - 50k", value: "10000-50000" },
  { label: "50k - 100k", value: "50000-100000" },
  { label: "> 100k", value: "100000-" },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const path = usePathname();
  const isFiltered = table.getState().columnFilters.length > 0;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    table.getColumn("name")?.setFilterValue(value);
  }, 300);

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        <Input
          placeholder="Filtrer muligheter..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
            debouncedSearch(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <>
          {table.getColumn("stage") && (
            <DataTableFacetedFilter
              column={table.getColumn("stage")}
              title="Stadium"
              options={stageOptions}
            />
          )}
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statusOptions}
            />
          )}
          {table.getColumn("value") && (
            <DataTableFacetedFilter
              column={table.getColumn("value")}
              title="Verdi"
              options={valueRanges}
            />
          )}
        </>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              window.history.pushState({}, "", path);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Tilbakestill
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <SaveViewButton parentElement={3} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
