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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Loader2 } from "lucide-react";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { Separator } from "@/components/ui/separator";
import { getWorkspaceUsers } from "@/actions/workspace/get-workspace-users";
import { updateCompany } from "@/actions/company/update-companies";
import { toast } from "sonner";
import { AccountOwner, WorkspaceData } from "@/lib/internal-api/types";

export function AccountOwnerCombobox({
  companyId,
  onOwnerAdded,
  currentAccountOwners,
}: {
  companyId: string;
  onOwnerAdded: (owner: AccountOwner) => void;
  currentAccountOwners: number[];
}) {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();
  const [selectedOwner, setSelectedOwner] = React.useState<AccountOwner | null>(
    null
  );
  const [accountOwners, setAccountOwners] = React.useState<AccountOwner[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && accountOwners.length === 0) {
      setIsLoading(true);
      getWorkspaceUsers().then((response) => {
        if (response) {
          const validOwners: AccountOwner[] = response
            .filter(
              (
                user
              ): user is WorkspaceData & { clerk_id: string; email: string } =>
                user.clerk_id !== undefined && user.email !== undefined
            )
            .map((user) => ({
              id: user.id,
              email: user.email,
              username: user.username ?? null,
              first_name: user.first_name ?? null,
              last_name: user.last_name ?? null,
              clerk_id: user.clerk_id,
            }));
          setAccountOwners(validOwners);
        }
        setIsLoading(false);
      });
    }
  }, [open, accountOwners.length]);

  React.useEffect(() => {}, [accountOwners]);

  const handleSelectOwner = async (owner: AccountOwner) => {
    setSelectedOwner(owner);
    setOpen(false);
    try {
      const updatedAccountOwners = [...currentAccountOwners, owner.id];
      const updatedCompany = await updateCompany(companyId, {
        account_owners: updatedAccountOwners,
      });
      if (updatedCompany) {
        onOwnerAdded(owner);
        toast.success(
          `${owner.first_name || owner.email} lagt til som ansvarlig`
        );
      } else {
        toast.error("Kunne ikke oppdatere kontoansvarlig");
      }
    } catch (error) {
      console.error("Error updating account owner:", error);
      toast.error("En feil oppstod under oppdatering av kontoansvarlig");
    }
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <OwnerList
            setOpen={setOpen}
            setSelectedOwner={setSelectedOwner}
            accountOwners={accountOwners}
            isLoading={isLoading}
            handleSelectOwner={handleSelectOwner}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OwnerList
            setOpen={setOpen}
            setSelectedOwner={setSelectedOwner}
            accountOwners={accountOwners}
            isLoading={isLoading}
            handleSelectOwner={handleSelectOwner}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OwnerList({
  setOpen,
  setSelectedOwner,
  accountOwners,
  isLoading,
  handleSelectOwner,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOwner: (owner: AccountOwner | null) => void;
  accountOwners: AccountOwner[];
  isLoading: boolean;
  handleSelectOwner: (owner: AccountOwner) => void;
}) {
  return (
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
            accountOwners.map((owner) => (
              <CommandItem
                key={owner.id}
                value={`${owner.first_name || ""} ${owner.last_name || ""} ${
                  owner.email
                }`.trim()}
                onSelect={() => handleSelectOwner(owner)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                    {owner.first_name
                      ? owner.first_name.charAt(0).toUpperCase()
                      : owner.email.charAt(0).toUpperCase()}
                  </div>
                  {owner.first_name && owner.last_name
                    ? `${owner.first_name} ${owner.last_name}`
                    : owner.email}
                </div>
              </CommandItem>
            ))
          )}
        </CommandGroup>
        <Separator className="my-2" />
        <CommandItem
          onSelect={() => {
            // Handle adding a new account owner
            setOpen(false);
          }}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <Plus className="h-4 w-4" />
            </div>
            Legg til ny
          </div>
        </CommandItem>
      </CommandList>
    </Command>
  );
}
