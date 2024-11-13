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
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import FilterButton from "../filter-button"
import { useCallback } from "react"

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSize = searchParams.get("page_size") ?? "10"

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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("cursor")

      if (name && value) {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} rad(er) valgt.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rader per side</p>
          <Select
            value={currentSize}
            onValueChange={(value) => {
              setLoading(true)
              router.push(
                pathname + "?" + createQueryString("page_size", value)
              )
            }}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
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
        <div className="flex items-center space-x-2">
          <FilterButton
            onClick={setLoading}
            param="cursor"
            value=""
            variant="outline"
            className="lg:flex"
            disabled={!pagination.prev}>
            <DoubleArrowLeftIcon className="h-4 w-4" />
            <span>Første</span>
          </FilterButton>
          <FilterButton
            onClick={setLoading}
            variant="outline"
            param="cursor"
            value={prev}
            disabled={!pagination.prev}>
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Forrige</span>
          </FilterButton>
          <FilterButton
            onClick={setLoading}
            variant="outline"
            param="cursor"
            value={next}
            disabled={!pagination.next}>
            <span>Neste</span>
            <ChevronRightIcon className="h-4 w-4" />
          </FilterButton>
        </div>
      </div>
    </div>
  )
}
