"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "./types";
import { DataTableColumnHeader } from "@/components/company/company-table/data-table-column-header";
import Link from "next/link";
import {
  formatDistanceToNow,
  parseISO,
  isToday,
  isThisWeek,
  isThisMonth,
  isPast,
  addWeeks,
  isBefore,
  isAfter,
} from "date-fns";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskUserCombobox } from "./task-user-combobox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AssignUserDialog } from "./assign-user-dialog";

export const deadlineFilter = (
  row: any,
  columnId: string,
  filterValue: string[]
) => {
  const date = parseISO(row.getValue(columnId));
  const now = new Date();
  const nextWeekStart = addWeeks(now, 1);
  const nextWeekEnd = addWeeks(now, 2);

  return filterValue.some((filter) => {
    switch (filter) {
      case "overdue":
        return isPast(date) && !isToday(date);
      case "today":
        return isToday(date);
      case "this-week":
        return isThisWeek(date) && !isToday(date);
      case "next-week":
        return isAfter(date, nextWeekStart) && isBefore(date, nextWeekEnd);
      case "this-month":
        return isThisMonth(date) && !isThisWeek(date);
      case "later":
        return isAfter(date, nextWeekEnd);
      default:
        return true;
    }
  });
};

export const userFilter = (
  row: any,
  columnId: string,
  filterValue: string[]
) => {
  const userDetails = row.original.user_details;
  if (!userDetails) return false;

  const userName = `${userDetails.first_name ?? ""} ${
    userDetails.last_name ?? ""
  }`
    .trim()
    .toLowerCase();

  return filterValue.some((filter) => userName === filter);
};

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

      const getStatusLabel = (status: string) => {
        switch (status) {
          case "todo":
            return "Todo";
          case "in_progress":
            return "In Progress";
          case "done":
            return "Done";
          default:
            return status;
        }
      };

      return (
        <Select defaultValue={task.status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full border-0 bg-transparent h-8 p-0 hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0">
            <SelectValue>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {getStatusLabel(task.status)}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Todo
              </span>
            </SelectItem>
            <SelectItem value="in_progress">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                In Progress
              </span>
            </SelectItem>
            <SelectItem value="done">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Done
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "date",
    filterFn: deadlineFilter,
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
    accessorKey: "user_details",
    filterFn: userFilter,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ansvarlig" />
    ),
    cell: ({ row, table }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const userDetails = row.original.user_details;

      const handleAssignSuccess = (updatedTask: Task) => {
        table.options.meta?.updateData(row.index, "user", updatedTask.user);
        table.options.meta?.updateData(
          row.index,
          "user_details",
          updatedTask.user_details
        );
      };

      return (
        <>
          <Button
            variant="ghost"
            className="flex items-center gap-2 h-8 w-full justify-start p-0"
            onClick={() => setIsDialogOpen(true)}
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {userDetails?.first_name?.[0] || userDetails?.email?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {userDetails
                ? userDetails.first_name && userDetails.last_name
                  ? `${userDetails.first_name} ${userDetails.last_name}`
                  : userDetails.email
                : "Ikke tildelt"}
            </span>
          </Button>

          <AssignUserDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            taskId={row.original.uuid}
            currentUserId={row.original.user}
            onAssignSuccess={handleAssignSuccess}
          />
        </>
      );
    },
  },
];
