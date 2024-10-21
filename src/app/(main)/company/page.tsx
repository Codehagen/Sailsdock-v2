import { getCompanies } from "@/actions/company/get-companies";
import { CompanyTable } from "@/components/company/company-table/data-table";
import { columns } from "@/components/company/company-table/columns";
import { Button } from "@/components/ui/button";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

export default async function CompanyPage() {
  const { data: companies, totalCount } = await getCompanies(10, 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Bedrifter</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddCompanySheet />
        </div>
      </div>

      <div className="overflow-hidden">
        {companies && companies.length > 0 ? (
          <CompanyTable
            columns={columns}
            initialData={companies}
            initialTotalCount={totalCount}
          />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="building" />
            <EmptyPlaceholder.Title>
              Ingen bedrifter funnet
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Du har ikke lagt til noen bedrifter ennå. Legg til en bedrift for
              å komme i gang.
            </EmptyPlaceholder.Description>
            <AddCompanySheet />
          </EmptyPlaceholder>
        )}
      </div>
    </div>
  );
}
