import { getProspects } from "@/actions/prospects/get";
import { columnProspects } from "@/components/prospects/columns";
import { ProspectsTable } from "@/components/prospects/data-table";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProspectsPage(props: {
  searchParams: SearchParams;
}) {
  const params = await props.searchParams;
  const prospects = await getProspects(params);
  const { page_size = "" } = params;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Prospects</h2>
      </div>
      <div className="p-1">
        <ProspectsTable
          pagination={prospects.pagination}
          data={prospects.data}
          columns={columnProspects}
          page_size={page_size as string}
        />
      </div>
    </div>
  );
}
