"use client"

import { useEffect, useState } from "react"
import { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

type EmployeeFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
}

export default function DataTableEmployeeFilter<TData, TValue>({
  column,
}: EmployeeFilterProps<TData, TValue>) {
  const [minValue, setMinValue] = useState("")
  const [maxValue, setMaxValue] = useState("")

  useEffect(() => {
    const filterValue = column?.getFilterValue() as string[] | undefined
    if (filterValue) {
      setMinValue(filterValue[0] ? filterValue[0].toString() : "")
      setMaxValue(filterValue[1] ? filterValue[1].toString() : "")
    } else {
      setMinValue("")
      setMaxValue("")
    }
  }, [column?.getFilterValue()])


  const handleMinChange = (value: string) => {
    if (Number(value) > 100000) return
    setMinValue(value)
  }

  const handleMaxChange = (value: string) => {
    if (Number(value) > 100000) return
    setMaxValue(value)
  }

  const applyFilter = () => {
    const min = parseFloat(minValue)
    const max = parseFloat(maxValue)

    column?.setFilterValue([isNaN(min) ? 0 : min, isNaN(max) ? "" : max])
  }

  const resetFilter = () => {
    setMinValue("")
    setMaxValue("")
    column?.setFilterValue(undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Antall Ansatte
          {minValue || maxValue ? (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="flex space-x-1">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal">
                  Min: {minValue ? minValue : 0}
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal">
                  Max: {maxValue ? maxValue : "-"}
                </Badge>
              </div>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="grid gap-2 p-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="min">Minimum</Label>
            <Input
              id="min"
              type="number"
              placeholder="Min"
              className="col-span-2 h-8"
              value={minValue}
              onChange={(e) => handleMinChange(e.target.value)}
              onKeyUp={() => applyFilter()}
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="max">Maksimum</Label>
            <Input
              id="max"
              type="number"
              placeholder="Max"
              className="col-span-2 h-8"
              value={maxValue}
              onChange={(e) => handleMaxChange(e.target.value)}
              onKeyUp={() => applyFilter()}
            />
          </div>
        </div>
        {maxValue || minValue ? (
          <Button
            variant="ghost"
            className="w-full text-center border-t"
            onClick={resetFilter}>
            Tøm
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
