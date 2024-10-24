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
import { PersonData } from "@/lib/internal-api/types"; // Assuming this type exists
import { getAllPeople } from "@/actions/people/get-all-people";
import { updatePerson } from "@/actions/people/update-person";

export function PersonCombobox({
  companyId,
  onPersonAdded,
  currentPeople = [], // Default to an empty array if undefined
}: {
  companyId: number; // Ensure this is the correct type
  onPersonAdded: (person: PersonData) => void;
  currentPeople: number[];
}) {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();
  const [selectedPerson, setSelectedPerson] = React.useState<PersonData | null>(
    null
  );
  const [people, setPeople] = React.useState<PersonData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && people.length === 0) {
      setIsLoading(true);
      getAllPeople().then((response) => {
        if (response.data) {
          setPeople(response.data);
        }
        setIsLoading(false);
      });
    }
  }, [open, people.length]);

  const handleSelectPerson = async (person: PersonData) => {
    setSelectedPerson(person);
    setOpen(false);
    try {
      const updatedPerson = await updatePerson(person.uuid, {
        companies: [...currentPeople, companyId], // Ensure companyId is included
      });
      if (updatedPerson) {
        onPersonAdded(updatedPerson);
        toast.success(`${person.name} lagt til som person`);
      } else {
        throw new Error("Failed to update person");
      }
    } catch (error) {
      console.error("Error adding person:", error);
      toast.error("En feil oppstod under tillegging av person");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <PersonList
              setOpen={setOpen}
              setSelectedPerson={setSelectedPerson}
              people={people}
              isLoading={isLoading}
              handleSelectPerson={handleSelectPerson}
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
              <PersonList
                setOpen={setOpen}
                setSelectedPerson={setSelectedPerson}
                people={people}
                isLoading={isLoading}
                handleSelectPerson={handleSelectPerson}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

function PersonList({
  setOpen,
  setSelectedPerson,
  people,
  isLoading,
  handleSelectPerson,
}: {
  setOpen: (open: boolean) => void;
  setSelectedPerson: (person: PersonData | null) => void;
  people: PersonData[];
  isLoading: boolean;
  handleSelectPerson: (person: PersonData) => void;
}) {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Command>
      <CommandInput
        placeholder="Søk etter personer..."
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
            people.map((person) => (
              <CommandItem
                key={person.id}
                value={person.name}
                onSelect={() => handleSelectPerson(person)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  {person.name}
                </div>
              </CommandItem>
            ))
          )}
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
