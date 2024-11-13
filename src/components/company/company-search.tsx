"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { searchCompanies } from "@/actions/company/search-companies";
import { useDebounce } from "@/hooks/use-debounce";

interface CompanySearchProps {
  onSelect: (company: {
    value: string;
    label: string;
    address: string;
    postalCode: string;
    city: string;
  }) => void;
}

export function CompanySearch({ onSelect }: CompanySearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [companies, setCompanies] = React.useState<
    Array<{
      value: string;
      label: string;
      address: string;
      postalCode: string;
      city: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const debouncedSearch = useDebounce(inputValue, 300);

  React.useEffect(() => {
    async function fetchCompanies() {
      if (debouncedSearch.length < 2) {
        setCompanies([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchCompanies(debouncedSearch);
        setCompanies(results || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, [debouncedSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? companies.find((company) => company.value === value)?.label
            : "Søk etter selskap..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Søk etter selskapsnavn..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty className="py-6 text-center">
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                <p className="mt-2 text-sm text-muted-foreground">Søker...</p>
              </CommandEmpty>
            ) : companies.length === 0 ? (
              <CommandEmpty>
                {inputValue.length < 2
                  ? "Skriv minst 2 tegn for å søke..."
                  : "Ingen selskap funnet."}
              </CommandEmpty>
            ) : (
              <CommandGroup heading="Selskaper">
                {companies.map((company) => (
                  <CommandItem
                    key={company.value}
                    value={company.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      onSelect(company);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === company.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{company.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {company.address} {company.postalCode} {company.city}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
