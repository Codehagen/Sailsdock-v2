"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import { fylker } from "./data"
import { prospectSchema, prospectTableSchema } from "./types"
import { DataTableColumnHeader } from "../company/company-table/data-table-column-header"
import { Checkbox } from "../ui/checkbox"

export const columnProspects: ColumnDef<prospectTableSchema>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bedrift" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return (
        <span title={name} className="text-nowrap">
          {name}
        </span>
      )
    },
  },
  {
    accessorKey: "geo_street",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Addresse" />
    ),
    cell: ({ row }) => {
      const data: any = row?.getValue("geo_street")
      return (
        <span>
          {row.getValue("geo_street") !== "" ? data.replace("/n", " - ") : "-"}
        </span>
      )
    },
  },
  {
    accessorKey: "geo_municipalty",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Kommune" />
      </div>
    ),
    cell: ({ row }) => {
      //* Format text from uppercase to normal.
      const kommune: string = row.getValue("geo_municipalty") || ""
      const formattedGeoMunicipalty =
        kommune?.charAt(0).toUpperCase() + kommune?.slice(1).toLowerCase()
      return (
        <div className="hidden md:table-cell">
          <span>{formattedGeoMunicipalty}</span>
        </div>
      )
    },
  },
  // {
  //   accessorKey: "name",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Næring" />
  //   ),
  //   cell: ({ row }) => <span>{row.getValue("name")}</span>,
  // },
  /*   {
    accessorKey: "adm_num_employees",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ansatte" />
    ),
    cell: ({ row }) => <span>{row.getValue("adm_num_employees") !== 0 ? row.getValue("adm_num_employees") : "-"}</span>,
  }, */
  {
    accessorKey: "adm_founded_date",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Stiftet" />
      </div>
    ),
    cell: ({ row }) => {
      const created: string = row.getValue("adm_founded_date") || ""
      return (
        <div className="hidden md:table-cell">
          <span>
            {created.split("-")[0] !== "" ? created.split("-")[0] : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "adm_incorporation",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Selskap" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden md:table-cell">
        <span>
          {row.getValue("adm_incorporation") !== ""
            ? row.getValue("adm_incorporation")
            : "-"}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "orgnr",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Org.nr" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden md:table-cell">
        <span>
          {row.getValue("orgnr") !== "" ? row.getValue("orgnr") : "-"}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actionButton",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link
          href={`https://www.purehelp.no/m/company/account/${row.original.orgnr}`}
          target="_blank"
          passHref>
          <Button
            variant="outline"
            className="flex h-8 w-auto rounded-md px-4 py-2 text-xs">
            Regnskapstall
          </Button>
        </Link>
      </div>
    ),
  },
  {
    id: "Add",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Button
            disabled
            variant="ghost"
            className="w-full h-8 text-xs hover:text-primary">
            Add
          </Button>
        </div>
      )
      // return <AddLead data={row.original} />
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActionsCustomer row={row} />,
  // },

  // {
  //   id: "fylke",
  //   accessorKey: "geo_county",

  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="geo_county" />
  //   ),
  //   cell: ({ row }) => {
  //     const geo_county = fylker.find(
  //       (geo_county) => geo_county.value === row.getValue("geo_county")
  //     )

  //     if (!geo_county) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center">
  //         <span>{geo_county.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
]
