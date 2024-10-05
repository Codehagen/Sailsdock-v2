import { DashboardShell } from "@/components/shell/shell";
import { DashboardHeader } from "@/components/shell/header";
import { getCompanyDetails } from "@/actions/company/get-details-companies";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { CompanyUserDetails } from "@/components/company-user/CompanyUserDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  CheckSquare,
  FileText,
  File,
  Mail,
  Calendar,
} from "lucide-react";

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
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span>Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span>Files</span>
              </TabsTrigger>
              <TabsTrigger value="emails" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Emails</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
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
