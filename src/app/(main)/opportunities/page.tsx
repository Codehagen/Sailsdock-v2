import Link from "next/link";
import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";
import { getOpportunities } from "@/actions/opportunity/get-opportunities";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { OpportunityData } from "@/lib/internal-api/types";

export default async function OpportunityPage() {
  const { data: opportunities, totalCount } = await getOpportunities(10, 1);
  console.log(opportunities);

  return (
    <DashboardShell>
      <DashboardHeader heading="Muligheter" text="UNDER UTVIKLING 🧹">
        <AddCompanySheet />
      </DashboardHeader>

      {opportunities && opportunities.length > 0 ? (
        <KanbanBoard opportunities={opportunities as OpportunityData[]} />
      ) : (
        <p className="text-center py-4">Ingen muligheter funnet.</p>
      )}
    </DashboardShell>
  );
}
