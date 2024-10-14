import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";
import { getCompanies } from "@/actions/company/get-companies";
import { CompanyTable } from "@/components/company/company-table/data-table";
import { columns } from "@/components/company/company-table/columns";
import { getOpportunities } from "@/actions/opportunity/get-opportunities";

export default async function OpportunityPage() {
  const { data: opportunities, totalCount } = await getOpportunities(10, 1);
  console.log(opportunities);

  return (
    <DashboardShell>
      <DashboardHeader heading="Muligheter" text="Dine muligheter">
        <AddCompanySheet />
      </DashboardHeader>

      <p>Ingen muligheter funnet.</p>
    </DashboardShell>
  );
}
