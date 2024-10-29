"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { updateTask } from "@/actions/tasks/update-task";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getWorkspaceUsers } from "@/actions/workspace/get-workspace-users";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { WorkspaceData } from "@/lib/internal-api/types";
import { Task } from "@/lib/internal-api/types";

interface AssignUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  currentUserId: number;
  onAssignSuccess?: (updatedTask: Task) => void;
}

interface User {
  id: number;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

export function AssignUserDialog({
  open,
  onOpenChange,
  taskId,
  currentUserId,
  onAssignSuccess,
}: AssignUserDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && users.length === 0) {
      setIsLoading(true);
      getWorkspaceUsers().then((response) => {
        if (response) {
          const validUsers: User[] = response
            .filter(
              (user): user is WorkspaceData & { email: string } =>
                user.email !== undefined
            )
            .map((user) => ({
              id: user.id,
              email: user.email,
              username: user.username ?? null,
              first_name: user.first_name ?? null,
              last_name: user.last_name ?? null,
            }));
          setUsers(validUsers);
        }
        setIsLoading(false);
      });
    }
  }, [open, users.length]);

  const handleAssignUser = async (user: User) => {
    try {
      const updatedTask = await updateTask(taskId, {
        user: user.id,
      });

      if (updatedTask) {
        toast.success(`Oppgave tildelt ${user.first_name || user.email}`);
        onOpenChange(false);
        onAssignSuccess?.(updatedTask);
      } else {
        toast.error("Kunne ikke tildele oppgave");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("En feil oppstod under tildeling av oppgave");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tildel oppgave til bruker</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Søk etter personer..." />
          <CommandList>
            <CommandEmpty>Ingen resultater funnet.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <CommandItem>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Laster...
                </CommandItem>
              ) : (
                users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={`${user.first_name || ""} ${user.last_name || ""} ${
                      user.email
                    }`.trim()}
                    onSelect={() => handleAssignUser(user)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                        {user.first_name
                          ? user.first_name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </div>
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.email}
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
