import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCompanyDetails } from "@/actions/company/get-details-companies";
import { AddCompanySheet } from "@/components/company/AddCompanySheet";

export default async function CompanyUserPage({
  params,
}: {
  params: { id: string };
}) {
  const companyId = params.id;
  const companyDetails = await getCompanyDetails(companyId);

  if (!companyDetails) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Company not found"
          text="No company found with the provided ID."
        />
      </DashboardShell>
    );
  }

  // TODO: Fetch company details using companyId
  // const companyDetails = await getCompanyDetails(companyId);

  return (
    <DashboardShell>
      <DashboardHeader
        heading={companyDetails.name}
        text={`Detaljer for selskap med ID: ${companyId}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Org.nr: {companyDetails.orgnr}</p>
          <p>
            Adresse: {companyDetails.address_street},{" "}
            {companyDetails.address_zip} {companyDetails.address_city}
          </p>
          <p>
            Antall ansatte: {companyDetails.num_employees || "Ikke oppgitt"}
          </p>
          <p>Type: {companyDetails.type}</p>
          <p>Status: {companyDetails.status || "Ikke satt"}</p>
          <p>Prioritet: {companyDetails.priority || "Ikke satt"}</p>
          <p>
            Sist kontaktet:{" "}
            {new Date(companyDetails.last_contacted).toLocaleDateString(
              "no-NO"
            )}
          </p>
          <p>
            Kontaktperson:{" "}
            {companyDetails.default_contact?.name || "Ikke oppgitt"}
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
