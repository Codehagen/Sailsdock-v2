"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus } from "lucide-react";
import { AssignUserDialog } from "./assign-user-dialog";
import { useState } from "react";
import { Task } from "./types";

interface TaskRowActionsProps {
  row: Row<Task>;
  onAssignSuccess?: () => void;
}

export function TaskRowActions({ row, onAssignSuccess }: TaskRowActionsProps) {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const task = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Tildel bruker
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Add other actions here */}
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignUserDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        taskId={task.uuid}
        currentUserId={task.user}
        onAssignSuccess={onAssignSuccess}
      />
    </>
  );
}
