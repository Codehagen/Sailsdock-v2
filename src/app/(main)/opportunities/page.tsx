import { getUserOpportunities } from "@/actions/opportunity/get-user-opportunities";
import { DashboardShell } from "@/components/shell/shell";
import { columns } from "@/components/opportunity/opportunity-table/columns";
import { OpportunityTable } from "@/components/opportunity/opportunity-table/data-table";

export default async function OpportunitiesPage() {
  const { data: opportunities, totalCount } = await getUserOpportunities(10, 1);

  return (
    <DashboardShell className="p-0">
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b">
          <h1 className="text-3xl font-bold">Opportunities</h1>
        </div>
        <div className="p-6">
          <OpportunityTable
            columns={columns}
            initialData={opportunities || []}
            initialTotalCount={totalCount}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
