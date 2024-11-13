"use client"

import * as React from "react"
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import FilterButton from "@/components/filter-button"
import { useCallback } from "react"
export function FilterDropdown({
  setLoading,
  queryParam,
  options,
  title,
}: {
  queryParam: string
  options: {
    label: string
    value: string
  }[]
  title: string
  setLoading: (state: boolean) => void
}) {
  const [open, setOpen] = React.useState(false)
  const params = useSearchParams()
  const defaultValue = params.get(queryParam) ?? ""

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("cursor")

      if (name && !value) {
        params.delete(name)
      }
      if (name && value) {
        params.set(name, value)
      }
      if (!name && !value) {
        params.forEach((value, key) => {
          if (key === "page_size") return
          params.delete(key)
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="flex h-[32px] max-w-fit items-center rounded-md border border-dashed px-2">
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="h-full w-full justify-start p-0 hover:bg-transparent truncate">
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  {defaultValue
                    ? options
                        .find(
                          (option, index) =>
                            option.value.toLowerCase() ===
                            defaultValue.toLowerCase()
                        )
                        ?.label.substring(0, 20) + "..."
                    : title ?? "Velg"}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {defaultValue
                  ? options.find(
                      (option, index) =>
                        option.value.toLowerCase() ===
                        defaultValue.toLowerCase()
                    )?.label
                  : title ?? "Velg"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="h-auto w-auto p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Søk..."
            />
            <CommandList>
              <CommandEmpty>Ingen resultat.</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      setOpen(false)
                      setLoading(true)
                      router.push(
                        pathname +
                          "?" +
                          createQueryString(queryParam, option.value.toUpperCase())
                      )
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        defaultValue.toLowerCase() ===
                          option.value.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {defaultValue.toLowerCase() && defaultValue.trim() !== "" ? (
        <div className="flex h-10 items-center hover:cursor-pointer">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <FilterButton
                  onClick={() => setLoading(true)}
                  className="h-fit w-fit p-0 m-0"
                  variant="ghost"
                  param={queryParam}
                  value=""
                  asChild>
                  <Cross2Icon className="p-1 h-4 w-4 shrink-0 opacity-50" />
                </FilterButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tøm</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className="flex h-10 items-center hover:cursor-pointer">
          <ChevronsUpDown
            onClick={() => setOpen(true)}
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </div>
      )}
    </div>
  )
}
