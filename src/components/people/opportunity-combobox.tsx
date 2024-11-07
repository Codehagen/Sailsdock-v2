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
import { toast } from "sonner";
import { getOpportunities } from "@/actions/opportunity/get-opportunities";
import { updateOpportunity } from "@/actions/opportunity/update-opportunities";
import { OpportunityData } from "@/lib/internal-api/types";

interface OpportunityComboboxProps {
  personId: number;
  onOpportunityAdded: (opportunity: OpportunityData) => void;
  currentOpportunities: number[];
}

export function OpportunityCombobox({
  personId,
  onOpportunityAdded,
  currentOpportunities,
}: OpportunityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();
  const [selectedOpportunity, setSelectedOpportunity] =
    React.useState<OpportunityData | null>(null);
  const [opportunities, setOpportunities] = React.useState<OpportunityData[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && opportunities.length === 0) {
      setIsLoading(true);
      getOpportunities().then((response) => {
        if (response.data) {
          setOpportunities(response.data);
        }
        setIsLoading(false);
      });
    }
  }, [open, opportunities.length]);

  const handleSelectOpportunity = async (opportunity: OpportunityData) => {
    setSelectedOpportunity(opportunity);
    setOpen(false);
    try {
      // Add the person to the opportunity's people array
      const updatedOpportunity = await updateOpportunity(opportunity.uuid, {
        people: [...(opportunity.people || []), personId],
      });
      if (updatedOpportunity) {
        onOpportunityAdded(updatedOpportunity);
      } else {
        throw new Error("Failed to update opportunity");
      }
    } catch (error) {
      console.error("Error adding opportunity:", error);
      toast.error("En feil oppstod under tillegging av mulighet");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <OpportunityList
              opportunities={opportunities}
              isLoading={isLoading}
              handleSelectOpportunity={handleSelectOpportunity}
              currentOpportunities={currentOpportunities}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              Legg til mulighet
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <OpportunityList
                opportunities={opportunities}
                isLoading={isLoading}
                handleSelectOpportunity={handleSelectOpportunity}
                currentOpportunities={currentOpportunities}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

function OpportunityList({
  opportunities,
  isLoading,
  handleSelectOpportunity,
  currentOpportunities,
}: {
  opportunities: OpportunityData[];
  isLoading: boolean;
  handleSelectOpportunity: (opportunity: OpportunityData) => void;
  currentOpportunities: number[];
}) {
  const [inputValue, setInputValue] = React.useState("");

  // Filter out opportunities that are already associated
  const availableOpportunities = opportunities.filter(
    (opp) => !currentOpportunities.includes(opp.id)
  );

  return (
    <Command>
      <CommandInput
        placeholder="Søk etter muligheter..."
        value={inputValue}
        onValueChange={setInputValue}
      />
      <CommandList>
        <CommandEmpty>Ingen resultater funnet.</CommandEmpty>
        <CommandGroup>
          {isLoading ? (
            <CommandItem>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Laster...
            </CommandItem>
          ) : (
            availableOpportunities.map((opportunity) => (
              <CommandItem
                key={opportunity.id}
                value={opportunity.name}
                onSelect={() => handleSelectOpportunity(opportunity)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2">
                    {opportunity.name.charAt(0).toUpperCase()}
                  </div>
                  {opportunity.name}
                </div>
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
