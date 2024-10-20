"use client";

import * as React from "react";
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
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { getCompanies } from "@/actions/company/get-companies";
import { subDays, subMonths, subYears, parseISO } from "date-fns";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialData: TData[];
  initialTotalCount: number;
}

const arrRangeFilter = (row: any, columnId: string, filterValue: string) => {
  const arr = row.getValue(columnId);
  const [min, max] = filterValue.split("-").map(Number);
  return arr >= min && (max ? arr <= max : true);
};

const lastContactedFilter = (
  row: any,
  columnId: string,
  filterValue: string
) => {
  const lastContactedDate = parseISO(row.getValue(columnId));
  const now = new Date();
  const daysDiff = differenceInDays(now, lastContactedDate);
  const monthsDiff = differenceInMonths(now, lastContactedDate);
  const yearsDiff = differenceInYears(now, lastContactedDate);

  switch (filterValue) {
    case "last-week":
      return daysDiff < 7;
    case "last-month":
      return daysDiff < 30;
    case "last-3-months":
      return monthsDiff < 3;
    case "last-6-months":
      return monthsDiff < 6;
    case "last-year":
      return yearsDiff < 1;
    case "more-than-year":
      return yearsDiff >= 1;
    default:
      return true;
  }
};

export function CompanyTable<TData, TValue>({
  columns,
  initialData,
  initialTotalCount,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState(initialData);
  const [totalCount, setTotalCount] = React.useState(initialTotalCount);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
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
    pageCount: Math.ceil(totalCount / 10), // Assuming 10 items per page
    filterFns: {
      arrRange: arrRangeFilter,
      lastContactedRange: lastContactedFilter,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  React.useEffect(() => {
    async function fetchData() {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const { data: newData, totalCount: newTotalCount } = await getCompanies(
        pageSize,
        pageIndex + 1
      );
      if (newData) {
        setData(newData as TData[]);
        setTotalCount(newTotalCount);
      }
    }
    fetchData();
  }, [
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
  ]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <DataTableToolbar table={table} />
      <ScrollArea className="flex-grow rounded-md border">
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-0.5 px-2 border w-min"
                    >
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
                  className="h-24 text-center"
                >
                  Ingen resultater.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DataTablePagination table={table} />
    </div>
  );
}
