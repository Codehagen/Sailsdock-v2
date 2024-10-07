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

type Person = {
  uuid: string;
  name: string;
};

const people: Person[] = [
  { uuid: "1", name: "Christer Hagen" },
  { uuid: "2", name: "John Doe" },
  { uuid: "3", name: "Jane Doe" },
  // Add more people as needed
];

export function PersonCombobox() {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
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
          <PersonList setOpen={setOpen} setSelectedPerson={setSelectedPerson} />
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
          <PersonList setOpen={setOpen} setSelectedPerson={setSelectedPerson} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function PersonList({
  setOpen,
  setSelectedPerson,
}: {
  setOpen: (open: boolean) => void;
  setSelectedPerson: (person: Person | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search people..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {people.map((person) => (
            <CommandItem
              key={person.uuid}
              value={person.name}
              onSelect={() => {
                setSelectedPerson(person);
                setOpen(false);
              }}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                  {person.name.charAt(0)}
                </div>
                {person.name}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <Separator className="my-2" />
        <CommandItem
          onSelect={() => {
            // Handle adding a new person
            setOpen(false);
          }}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <Plus className="h-4 w-4" />
            </div>
            Legg til ny person
          </div>
        </CommandItem>
      </CommandList>
    </Command>
  );
}
