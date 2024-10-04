import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { getCompanyDetails } from "@/actions/company/get-details-companies";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { CompanyUserDetails } from "@/components/company-user/CompanyUserDetails";

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

  return (
    <DashboardShell>
      <DashboardHeader
        heading={companyDetails.name}
        text={`Detaljer for selskap med ID: ${companyId}`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyUserDetails companyDetails={companyDetails} />
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="layout" />
          <EmptyPlaceholder.Title>No content yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You haven't added any content to this section yet. Start creating
            content to see it here.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      </div>
    </DashboardShell>
  );
}
