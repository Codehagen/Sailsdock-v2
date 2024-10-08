import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";
import { getCompanies } from "@/actions/company/get-companies";
import { CompanyTable } from "@/components/company/company-table/data-table";
import { columns } from "@/components/company/company-table/columns";

export default async function CompanyPage() {
  const companies = await getCompanies();

  return (
    <DashboardShell>
      <DashboardHeader heading="Selskaper" text="Dine selskaper">
        <AddCompanySheet />
      </DashboardHeader>

      {companies ? (
        <CompanyTable columns={columns} data={companies} />
      ) : (
        <p>Ingen selskaper funnet.</p>
      )}
    </DashboardShell>
  );
}
