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
import { updatePerson } from "@/actions/people/update-person";
import { getCompanies } from "@/actions/company/get-companies";

interface Company {
  id: number;
  uuid: string;
  name: string;
}

interface CompanyComboboxProps {
  personId: string;
  onCompanyAdded: (company: Company) => void;
}

export function CompanyCombobox({
  personId,
  onCompanyAdded,
}: CompanyComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useMediaQuery();
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(
    null
  );
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && companies.length === 0) {
      setIsLoading(true);
      getCompanies().then((response) => {
        if (response.data) {
          setCompanies(response.data);
        }
        setIsLoading(false);
      });
    }
  }, [open, companies.length]);

  const handleSelectCompany = async (company: Company) => {
    setSelectedCompany(company);
    setOpen(false);
    try {
      const updatedPerson = await updatePerson(personId, {
        company: company.id,
      });
      if (updatedPerson) {
        onCompanyAdded({
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          last_contacted: new Date().toISOString(),
          potential_revenue: 0,
          contact_points: [],
          num_tasks: 0,
        });
      } else {
        throw new Error("Failed to update person");
      }
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("En feil oppstod under tillegging av selskap");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              Legg til selskap
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <CompanyList
              companies={companies}
              isLoading={isLoading}
              handleSelectCompany={handleSelectCompany}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              Legg til selskap
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <CompanyList
                companies={companies}
                isLoading={isLoading}
                handleSelectCompany={handleSelectCompany}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

function CompanyList({
  companies,
  isLoading,
  handleSelectCompany,
}: {
  companies: Company[];
  isLoading: boolean;
  handleSelectCompany: (company: Company) => void;
}) {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Command>
      <CommandInput
        placeholder="Søk etter selskap..."
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
            companies.map((company) => (
              <CommandItem
                key={company.id}
                value={company.name}
                onSelect={() => handleSelectCompany(company)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                  {company.name}
                </div>
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
