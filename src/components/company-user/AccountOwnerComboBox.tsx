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
import { Plus } from "lucide-react";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { Separator } from "@/components/ui/separator";

type AccountOwner = {
  uuid: string;
  name: string;
};

const accountOwners: AccountOwner[] = [
  { uuid: "1", name: "John Doe" },
  { uuid: "2", name: "Jane Smith" },
  { uuid: "3", name: "Alice Johnson" },
  // Add more account owners as needed
];

export function AccountOwnerCombobox() {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();
  const [selectedOwner, setSelectedOwner] = React.useState<AccountOwner | null>(
    null
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <OwnerList setOpen={setOpen} setSelectedOwner={setSelectedOwner} />
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
          <OwnerList setOpen={setOpen} setSelectedOwner={setSelectedOwner} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OwnerList({
  setOpen,
  setSelectedOwner,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOwner: (owner: AccountOwner | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search account owners..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {accountOwners.map((owner) => (
            <CommandItem
              key={owner.uuid}
              value={owner.name}
              onSelect={() => {
                setSelectedOwner(owner);
                setOpen(false);
              }}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  {owner.name.charAt(0)}
                </div>
                {owner.name}
              </div>
            </CommandItem>
          ))}
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
