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
import { getOpportunities } from "@/actions/opportunity/get-opportunities";
import { toast } from "sonner";
import { OpportunityData } from "@/lib/internal-api/types";
import { AddOpportunitySheet } from "@/components/company-user/AddOpportunitySheet";

export function OpportunityCombobox({
  companyId,
  onOpportunityAdded,
  currentOpportunities,
}: {
  companyId: string;
  onOpportunityAdded: (opportunity: OpportunityData) => void;
  currentOpportunities: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);
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
      onOpportunityAdded(opportunity);
      toast.success(`${opportunity.name} lagt til som mulighet`);
    } catch (error) {
      console.error("Error adding opportunity:", error);
      toast.error("En feil oppstod under tillegging av mulighet");
    }
  };

  const handleAddNewOpportunity = () => {
    setOpen(false);
    setIsAddSheetOpen(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <AddOpportunitySheet
        companyId={companyId}
        onOpportunityAdded={onOpportunityAdded}
        isOpen={isAddSheetOpen}
        setIsOpen={setIsAddSheetOpen}
      />
      {isDesktop ? (
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
              opportunities={opportunities}
              isLoading={isLoading}
              handleSelectOpportunity={handleSelectOpportunity}
              handleAddNewOpportunity={handleAddNewOpportunity}
            />
          </PopoverContent>
        </Popover>
      ) : (
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
                opportunities={opportunities}
                isLoading={isLoading}
                handleSelectOpportunity={handleSelectOpportunity}
                handleAddNewOpportunity={handleAddNewOpportunity}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

function OpportunityList({
  setOpen,
  setSelectedOpportunity,
  opportunities,
  isLoading,
  handleSelectOpportunity,
  handleAddNewOpportunity,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOpportunity: (opportunity: OpportunityData | null) => void;
  opportunities: OpportunityData[];
  isLoading: boolean;
  handleSelectOpportunity: (opportunity: OpportunityData) => void;
  handleAddNewOpportunity: () => void;
}) {
  const [inputValue, setInputValue] = React.useState("");

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
            opportunities.map((opportunity) => (
              <CommandItem
                key={opportunity.uuid}
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
        <Separator className="my-2" />
        <CommandItem onSelect={handleAddNewOpportunity}>
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
