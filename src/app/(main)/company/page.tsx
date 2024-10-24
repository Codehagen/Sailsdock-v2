import { Suspense } from "react";
import { getCompanies } from "@/actions/company/get-companies";
import { CompanyTable } from "@/components/company/company-table/data-table";
import { columns } from "@/components/company/company-table/columns";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { CompanyTableSkeleton } from "@/components/company/company-table-skeleton";

export default async function CompanyPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Bedrifter</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddCompanySheet />
        </div>
      </div>

      <div className="overflow-hidden p-1">
        <Suspense fallback={<CompanyTableSkeleton />}>
          <CompanyTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function CompanyTableWrapper() {
  const { data: companies, totalCount } = await getCompanies(10, 1);

  if (companies && companies.length > 0) {
    return (
      <CompanyTable
        columns={columns}
        initialData={companies as any}
        initialTotalCount={totalCount}
      />
    );
  } else {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="building" />
        <EmptyPlaceholder.Title>Ingen bedrifter funnet</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du har ikke lagt til noen bedrifter ennå. Legg til en bedrift for å
          komme i gang.
        </EmptyPlaceholder.Description>
        <AddCompanySheet />
      </EmptyPlaceholder>
    );
  }
}
