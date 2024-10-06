import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";
import Link from "next/link";
import { getCompanies } from "@/actions/company/get-companies";

export default async function CompanyPage() {
  const companies = await getCompanies();

  return (
    <DashboardShell>
      <DashboardHeader heading="Selskaper" text="Dine selskaper">
        <AddCompanySheet />
      </DashboardHeader>

      {companies && companies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/company/${company.uuid}`}
                    className="hover:underline"
                  >
                    {company.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Org.nr: {company.orgnr}</p>
                <p>
                  Adresse: {company.address_street}, {company.address_zip}{" "}
                  {company.address_city}
                </p>
                <p>Antall ansatte: {company.num_employees || "Ikke oppgitt"}</p>
                <p>Type: {company.type}</p>
                <p>Status: {company.status || "Ikke satt"}</p>
                <p>Prioritet: {company.priority || "Ikke satt"}</p>
                <p>
                  Sist kontaktet:{" "}
                  {new Date(company.last_contacted).toLocaleDateString("no-NO")}
                </p>
                <p>
                  Kontaktperson:{" "}
                  {company.default_contact?.name || "Ikke oppgitt"}
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
            Du har ikke lagt til noen selskaper. Legg til et selskap for å komme
            i gang.
          </EmptyPlaceholder.Description>
          <Button className="mt-4">Legg til selskap</Button>
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  );
}
