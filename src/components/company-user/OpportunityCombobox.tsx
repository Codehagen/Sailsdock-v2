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

type Opportunity = {
  uuid: string;
  name: string;
};

const opportunities: Opportunity[] = [
  { uuid: "1", name: "Mulighet 1" },
  { uuid: "2", name: "Mulighet 2" },
  { uuid: "3", name: "Mulighet 3" },
  // Add more opportunities as needed
];

export function OpportunityCombobox() {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();
  const [selectedOpportunity, setSelectedOpportunity] =
    React.useState<Opportunity | null>(null);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <OpportunityList
            setOpen={setOpen}
            setSelectedOpportunity={setSelectedOpportunity}
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
          <OpportunityList
            setOpen={setOpen}
            setSelectedOpportunity={setSelectedOpportunity}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OpportunityList({
  setOpen,
  setSelectedOpportunity,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOpportunity: (opportunity: Opportunity | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search opportunities..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {opportunities.map((opportunity) => (
            <CommandItem
              key={opportunity.uuid}
              value={opportunity.name}
              onSelect={() => {
                setSelectedOpportunity(opportunity);
                setOpen(false);
              }}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2">
                  {opportunity.name.charAt(0)}
                </div>
                {opportunity.name}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <Separator className="my-2" />
        <CommandItem
          onSelect={() => {
            // Handle adding a new opportunity
            setOpen(false);
          }}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <Plus className="h-4 w-4" />
            </div>
            Legg til ny mulighet
          </div>
        </CommandItem>
      </CommandList>
    </Command>
  );
}
