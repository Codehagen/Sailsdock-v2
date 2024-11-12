import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import FilterButton from "../filter-button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pagination: {
    prev: string | null
    next: string | null
  }
  setLoading: (state: boolean) => void
}

export function DataTablePagination<TData>({
  table,
  pagination,
  setLoading,
}: DataTablePaginationProps<TData>) {
  let next = ""
  let prev = ""
  if (pagination.next) {
    const nextParams = new URL(pagination.next)
    const nextSearch = new URLSearchParams(nextParams.searchParams)
    next = nextSearch.get("cursor")?.toString() ?? ""
  }
  if (pagination.prev) {
    const prevParams = new URL(pagination.prev)
    const prevSearch = new URLSearchParams(prevParams.searchParams)
    prev = prevSearch.get("cursor")?.toString() ?? ""
  }

  // Todo: Fix page size
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <FilterButton
            onClick={setLoading}
            param="cursor"
            value=""
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!pagination.prev}>
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </FilterButton>
          <FilterButton
            onClick={setLoading}
            variant="outline"
            className="h-8 w-8 p-0"
            param="cursor"
            value={prev}
            disabled={!pagination.prev}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </FilterButton>
          <FilterButton
            onClick={setLoading}
            variant="outline"
            className="h-8 w-8 p-0"
            param="cursor"
            value={next}
            disabled={!pagination.next}>
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </FilterButton>
        </div>
      </div>
    </div>
  )
}
