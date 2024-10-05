import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { getCompanyDetails } from "@/actions/company/get-details-companies";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { CompanyUserDetails } from "@/components/company-user/CompanyUserDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      {/* <DashboardHeader
        heading={companyDetails.name}
        text={`Details for company with ID: ${companyId}`}
      /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CompanyUserDetails companyDetails={companyDetails} />
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">October 2024</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    You updated 3 fields on Vegard Enterprises
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Employees → 20</li>
                    <li>Domain Name → vg.no</li>
                    <li>LinkedIn → sailsdock.no</li>
                  </ul>
                </div>
                {/* Add more timeline items as needed */}
              </div>
            </TabsContent>
            <TabsContent value="tasks">
              <p>Tasks content</p>
            </TabsContent>
            <TabsContent value="notes">
              <p>Notes content</p>
            </TabsContent>
            <TabsContent value="files">
              <p>Files content</p>
            </TabsContent>
            <TabsContent value="emails">
              <p>Emails content</p>
            </TabsContent>
            <TabsContent value="calendar">
              <p>Calendar content</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}
