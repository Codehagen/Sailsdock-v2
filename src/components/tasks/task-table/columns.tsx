"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "./types";
import { DataTableColumnHeader } from "@/components/company/company-table/data-table-column-header";
import { DataTableRowActions } from "@/components/company/company-table/data-table-row-actions";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTask } from "@/actions/tasks/update-task";
import { toast } from "sonner";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tittel" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link
            href={`/tasks/${row.original.uuid}`}
            className="max-w-[500px] truncate font-medium hover:underline"
          >
            {row.getValue("title")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row, table }) => {
      const task = row.original;

      const onStatusChange = async (newStatus: string) => {
        table.options.meta?.updateData(row.index, "status", newStatus);

        try {
          const updatedTask = await updateTask(task.uuid, {
            status: newStatus,
          });
          if (updatedTask) {
            toast.success("Oppgavestatus oppdatert");
          } else {
            table.options.meta?.updateData(row.index, "status", task.status);
            toast.error("Kunne ikke oppdatere oppgavestatus");
          }
        } catch (error) {
          table.options.meta?.updateData(row.index, "status", task.status);
          console.error("Feil ved oppdatering av oppgavestatus:", error);
          toast.error("En feil oppstod under oppdatering av oppgavestatus");
        }
      };

      const getStatusColor = (status: string) => {
        switch (status) {
          case "done":
            return "bg-green-100 text-green-800";
          case "in_progress":
            return "bg-yellow-100 text-yellow-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <Select defaultValue={task.status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full h-9 px-2 py-1 text-left">
            <SelectValue>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status === "todo"
                  ? "Todo"
                  : task.status === "in_progress"
                  ? "In Progress"
                  : "Done"}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Å gjøre</SelectItem>
            <SelectItem value="in_progress">Pågår</SelectItem>
            <SelectItem value="done">Ferdig</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate text-muted-foreground">
          {row.getValue("type")}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Frist" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return (
        <span className="max-w-[500px] truncate text-muted-foreground">
          {formatDistanceToNow(parseISO(date), {
            addSuffix: true,
            locale: nb,
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
