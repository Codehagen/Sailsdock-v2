import { getProspects } from "@/actions/prospects/get"
import { columnProspects } from "@/components/prospects/columns"
import { ProspectsTable } from "@/components/prospects/data-table"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ProspectsPage(props: {
  searchParams: SearchParams
}) {
  const params = await props.searchParams
  
  const prospects = await getProspects(params)

  return (
    <div className="p-1">
      <ProspectsTable pagination={prospects.pagination} data={prospects.data} columns={columnProspects} />
    </div>
  )
}
