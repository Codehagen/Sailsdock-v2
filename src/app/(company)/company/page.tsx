import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { Button } from "@/components/ui/button";
import { getCompanies } from "@/actions/company/get-companies";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function CompanyPage() {
  const companies = await getCompanies();

  return (
    <DashboardShell>
      <DashboardHeader heading="Selskaper" text="Dine selskaper">
        <Button>Legg til selskap</Button>
      </DashboardHeader>

      {companies && companies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Org.nr: {company.orgnr}</p>
                <p>Adresse: {company.address_1}</p>
                <p>Antall ansatte: {company.num_employees}</p>
                <p>
                  Eier: {company.owner_details.first_name}{" "}
                  {company.owner_details.last_name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="building" />
          <EmptyPlaceholder.Title>
            Ingen selskaper funnet
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Du har ikke lagt til noen selskaper ennå. Legg til et selskap for å
            komme i gang.
          </EmptyPlaceholder.Description>
          <Button className="mt-4">Legg til selskap</Button>
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  );
}
