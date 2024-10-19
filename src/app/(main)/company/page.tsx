import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";
import { getCompanies } from "@/actions/company/get-companies";
import { CompanyTable } from "@/components/company/company-table/data-table";
import { columns } from "@/components/company/company-table/columns";

export default async function CompanyPage() {
  const { data: companies, totalCount } = await getCompanies(10, 1);

  return (
    <DashboardShell className="">
      {/* <DashboardShell className="h-[calc(100vh-64px)] grid-rows-[auto,1fr]"> */}
      <DashboardHeader heading="Bedrifter" text="Dine bedrifter">
        <AddCompanySheet />
      </DashboardHeader>

      <div className="overflow-hidden">
        {companies ? (
          <CompanyTable
            columns={columns}
            initialData={companies}
            initialTotalCount={totalCount}
          />
        ) : (
          <p>Ingen selskaper funnet.</p>
        )}
      </div>
    </DashboardShell>
  );
}
