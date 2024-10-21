"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { nb } from "date-fns/locale";

// Custom function to capitalize the first letter of each word
function capitalizeFirstLetter(string: string) {
  return string.replace(/\b\w/g, (l) => l.toUpperCase());
}

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {capitalizeFirstLetter(
                    format(date.from, "LLL dd, y", { locale: nb })
                  )}{" "}
                  -{" "}
                  {capitalizeFirstLetter(
                    format(date.to, "LLL dd, y", { locale: nb })
                  )}
                </>
              ) : (
                capitalizeFirstLetter(
                  format(date.from, "LLL dd, y", { locale: nb })
                )
              )
            ) : (
              <span>Velg en dato</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={nb}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
