"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, UserCircle } from "lucide-react";
import { getWorkspaceUsers } from "@/actions/workspace/get-workspace-users";
import { updateTask } from "@/actions/tasks/update-task";
import { toast } from "sonner";
import { WorkspaceData } from "@/lib/internal-api/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskUser {
  id: number;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface TaskUserComboboxProps {
  taskId: string;
  currentUserId?: number | null;
  onUserUpdated: () => void;
}

export function TaskUserCombobox({
  taskId,
  currentUserId,
  onUserUpdated,
}: TaskUserComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<TaskUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && users.length === 0) {
      setIsLoading(true);
      getWorkspaceUsers().then((response) => {
        if (response) {
          const validUsers: TaskUser[] = response
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

  const handleSelectUser = async (user: TaskUser) => {
    setOpen(false);
    try {
      await updateTask(taskId, {
        user: user.id,
      });
      onUserUpdated();
      toast.success(`Oppgave tildelt ${user.first_name || user.email}`);
    } catch (error) {
      console.error("Error updating task user:", error);
      toast.error("Kunne ikke oppdatere bruker");
    }
  };

  const currentUser = users.find((user) => user.id === currentUserId);
  const buttonLabel = currentUser
    ? currentUser.first_name || currentUser.email
    : "Tildel bruker";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-8 w-full justify-start"
        >
          <UserCircle className="h-4 w-4" />
          <span className="truncate">{buttonLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
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
                    onSelect={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>
                          {user.first_name
                            ? user.first_name.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
      </PopoverContent>
    </Popover>
  );
}
