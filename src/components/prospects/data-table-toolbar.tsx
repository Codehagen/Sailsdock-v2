"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/company/company-table/data-table-view-options";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterNaceGroup } from "./filters/filter-nace-group-button";
import { filterEmptySearchParams } from "@/lib/utils";
import FilterButton from "../filter-button";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { byer, kommuner, NACE_nmbr_grp } from "./data";
import { FilterDropdown } from "./filters/filter-dropdown";
import { BulkAddCompanies } from "./bulk-add-companies";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  setLoading: (state: boolean) => void;
}

export function DataTableToolbar<TData>({
  table,
  setLoading,
}: DataTableToolbarProps<TData>) {
  const [value, setValue] = useState("");
  const params = useSearchParams();
  const isFiltered = filterEmptySearchParams(Object.fromEntries(params));
  const queries = Object.entries(isFiltered as any).filter(
    ([key, value]) => key !== "page_size"
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      console.log(name, value);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("cursor");

      if (name && !value) {
        params.delete(name);
      }
      if (name && value) {
        params.set(name, value);
      }
      if (!name && !value) {
        const pageSize = params.get("page_size");
        if (pageSize) {
          params.forEach((value, key) => {
            if (key === "page_size") return;
            params.delete(key);
          });
        }
      }

      return params.toString();
    },
    [searchParams]
  );

  function handleSearch() {
    setLoading(true);
    router.push(pathname + "?" + createQueryString("search", value));
  }

  const sortedMunicipalties = kommuner.slice().sort((a, b) => {
    return a.label.localeCompare(b.label);
  });

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        <Input
          value={value}
          placeholder={"Filtrer selskaper..."}
          className={"h-8 w-[150px] lg:w-[250px]"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant="outline" className="h-8" onClick={handleSearch}>
          Søk
        </Button>
        <>
          <FilterDropdown
            title="By"
            queryParam="geo_city"
            options={byer}
            setLoading={setLoading}
          />
          <FilterDropdown
            title="Kommune"
            queryParam="geo_municipalty"
            options={sortedMunicipalties}
            setLoading={setLoading}
          />
          <FilterNaceGroup setLoading={setLoading} />
          {queries?.length ? (
            <FilterButton
              onClick={() => setLoading(true)}
              param=""
              value=""
              variant="ghost"
              className="h-8 px-2 lg:px-3"
            >
              Tilbakestill
              <Cross2Icon className="ml-2 h-4 w-4" />
            </FilterButton>
          ) : null}
        </>
      </div>
      <div className="flex items-center space-x-2">
        <BulkAddCompanies table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
