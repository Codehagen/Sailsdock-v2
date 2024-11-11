"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/company/company-table/data-table-view-options"
import { SaveViewButton } from "@/components/ui/save-view-button"
import { DataTableFacetedFilter } from "@/components/company/company-table/data-table-faceted-filter"
import { usePathname } from "next/navigation"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  data?: TData[]
}

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  //! SERVER FILTERING WILL BREAK FILTER OPTIONS
  const path = usePathname()
  const isFiltered = table.getState().columnFilters.length > 0
  const companies = table
    .getCoreRowModel()
    .flatRows.reduce(
      (acc: { label: string; value: string; icon: any }[], row: any) => {
        const value = row.original.companies.map((obj: any) => ({
          label: obj.name,
          value: obj.name.toLowerCase(),
          icon: undefined,
        }))
        if (
          !acc.some((val) =>
            value.some((valu: any) => val.value === valu.value)
          )
        ) {
          acc.push(...value)
        }
        return acc
      },
      []
    ) as any


  const titleList = table
    .getCoreRowModel()
    .flatRows.reduce(
      (acc: { value: string; label: string; icon: any }[], row: any) => {
        const label = row.original.title
        const value = label.toLowerCase()

        if (!acc.some((item) => item.value === value)) {
          acc.push({ value, label, icon: undefined })
        }

        return acc
      },
      []
    ) as any

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        <Input
          placeholder="Filtrer personer..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* Add any additional filters specific to people here */}
        <>
          {table.getColumn("title") && (
            <DataTableFacetedFilter
              column={table.getColumn("title")}
              title="Tittel"
              options={titleList}
            />
          )}
          {table.getColumn("companies") && (
            <DataTableFacetedFilter
              column={table.getColumn("companies")}
              title="Selskaper"
              options={companies}
            />
          )}
        </>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              window.history.pushState({}, "", path)
            }}
            className="h-8 px-2 lg:px-3">
            Tilbakestill
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <SaveViewButton parentElement={2} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
