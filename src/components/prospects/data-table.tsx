"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useSearchParams } from "next/navigation"
import { DataTablePagination } from "./data-table-pagination"
import { FilterNaceGroup } from "./filters/filter-nace-group-button"
import { Loader2 } from "lucide-react"
import { useEffect, useState, createContext, useContext } from "react"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: {
    next: string | null
    prev: string | null
  }
  page_size: string
}

const ProspectsTableContext = createContext<{
  table: ReturnType<typeof useReactTable> | null;
}>({ table: null });

export const useProspectsTable = () => useContext(ProspectsTableContext);

export function ProspectsTable<TData, TValue>({
  columns,
  data,
  pagination: serverPagination,
  page_size,
}: DataTableProps<TData, TValue>) {
  const [totalCount, setTotalCount] = React.useState()
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [data])
  

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: page_size ? Number(page_size) : 10
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <ProspectsTableContext.Provider value={{ table }}>
      <div className="space-y-4 h-full flex flex-col">
        <DataTableToolbar setLoading={setLoading} table={table} />
        <ScrollArea className="flex-grow rounded-md border relative">
          {loading ? (
            <div className="absolute z-50 inset-0 bg-muted/20 rounded-md">
              <Loader2 className="animate-spin z-50 absolute size-8 top-1/2 left-1/2 text-muted-foreground" />
            </div>
          ) : null}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="p-0.5 px-2 border w-min truncate overflow-hidden max-w-[380px]">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    Ingen resultater.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DataTablePagination
          setLoading={setLoading}
          pagination={serverPagination}
          table={table}
        />
      </div>
    </ProspectsTableContext.Provider>
  )
}
