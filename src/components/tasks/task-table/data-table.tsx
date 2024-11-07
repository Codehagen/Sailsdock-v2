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

import { DataTablePagination } from "@/components/company/company-table/data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Task } from "./types";
import { getUserTasks } from "@/actions/tasks/get-user-tasks";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialData: TData[];
  initialTotalCount: number;
}

interface DataTableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  refreshData: () => Promise<void>;
}

export function TaskTable<TData, TValue>({
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
      refreshData: async () => {
        const { data: freshData, totalCount: newTotalCount } =
          await getUserTasks(
            table.getState().pagination.pageSize,
            table.getState().pagination.pageIndex + 1
          );
        if (freshData) {
          setData(freshData as TData[]);
          setTotalCount(newTotalCount);
        }
      },
    } as DataTableMeta<TData>,
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
    pageCount: Math.ceil(totalCount / 10),
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <DataTableToolbar table={table} data={data as Task[]} />
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
