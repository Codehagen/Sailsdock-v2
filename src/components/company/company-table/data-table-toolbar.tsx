"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/company/company-table/data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { companyTypes, companyStatuses, companyPriorities } from "./data"
import { set } from "date-fns"
import { RotateCwSquare } from "lucide-react"
import DataTableEmployeeFilter from "./employee-filter"

const arrRanges = [
  { label: "< 100k", value: "0-100000" },
  { label: "100k - 500k", value: "100000-500000" },
  { label: "500k - 1M", value: "500000-1000000" },
  { label: "> 1M", value: "1000000-" },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  data: any[]
}

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const filteredRows = data.filter((row) => row.account_owners.length)
  // Unique list of account_owners (personer)
  const owners = filteredRows
    .flatMap((row) => row.account_owners)
    .reduce((uniqueOwners, owner: any) => {
      const ownerName = `${owner?.first_name ?? ""} ${
        owner?.last_name ?? ""
      }`.trim()
      const ownerValue = ownerName.toLowerCase()

      // Check if owner already exists
      if (!uniqueOwners.some((o: any) => o.value === ownerValue)) {
        uniqueOwners.push({
          value: ownerValue,
          label: ownerName,
          icon: undefined,
        })
      }

      return uniqueOwners
    }, [] as { value: string; label: string; icon: undefined }[])

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        <Input
          placeholder="Filtrer selskaper..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/*         {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={companyTypes}
          />
        )} */}
        {table.getColumn("account_owners") && (
          <DataTableFacetedFilter
            column={table.getColumn("account_owners")}
            title="Personer"
            options={owners}
          />
        )}
        {table.getColumn("num_employees") && (
          <DataTableEmployeeFilter column={table.getColumn("num_employees")} />
        )}
        {/*         {table.getColumn("num_employees") && (
          <DataTableFacetedFilter
            column={table.getColumn("num_employees")}
            title="Ansatte"
            options={companyStatuses}
          />
        )} */}
        {table.getColumn("arr") && (
          <DataTableFacetedFilter
            column={table.getColumn("arr")}
            title="ARR"
            options={arrRanges}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Tilbakestill
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
