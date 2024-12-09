"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/company/company-table/data-table-view-options";
import { SaveViewButton } from "@/components/ui/save-view-button";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import DataTableEmployeeFilter from "./employee-filter";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

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
  users: any;
  onSearch: (query: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  data = [],
  users,
  onSearch,
}: DataTableToolbarProps<TData>) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const isFiltered = table.getState().columnFilters.length > 0;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 300);

  const userList = users
    .filter((usr: any) => usr.first_name && usr.last_name)
    .reduce((acc: { value: string; label: string; icon: any }[], user: any) => {
      const name = `${user.first_name} ${user.last_name}`;
      const value = name.toLowerCase();

      if (!acc.some((item) => item.value === value)) {
        acc.push({ value, label: name, icon: undefined });
      }

      return acc;
    }, []);

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        <Input
          placeholder={"Filtrer selskaper..."}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
            debouncedSearch(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <>
          {table.getColumn("account_owners") && (
            <DataTableFacetedFilter
              column={table.getColumn("account_owners")}
              title="Personer"
              options={userList}
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
              options={userList}
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
