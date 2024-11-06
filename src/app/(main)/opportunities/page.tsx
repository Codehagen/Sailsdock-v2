import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { getOpportunities } from "@/actions/opportunity/get-opportunities";
import { DashboardShell } from "@/components/shell/shell";

export default async function OpportunitiesPage() {
  const { data: opportunities } = await getOpportunities();

  return (
    <DashboardShell className="p-0">
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b">
          <h1 className="text-3xl font-bold">Opportunities</h1>
        </div>
        <div className="flex-grow">
          <KanbanBoard opportunities={opportunities || []} />
        </div>
      </div>
    </DashboardShell>
  );
}
