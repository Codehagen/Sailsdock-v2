import { DashboardShell } from "@/components/shell/shell";
import { getCompanyDetails } from "@/actions/company/get-details-companies";
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
import { TasksContent } from "@/components/company/TasksContent";
import { NotesContent } from "@/components/company/NotesContent";
import { FilesContent } from "@/components/company/FilesContent";
import { EmailsContent } from "@/components/company/EmailsContent";
import { CalendarContent } from "@/components/company/CalendarContent";
import { TimelineContent } from "@/components/company/TimelineContent";

export default async function CompanyUserPage({
  params,
}: {
  params: { id: string };
}) {
  const companyId = params.id;
  const companyDetails = await getCompanyDetails(companyId);
  console.log(companyDetails);

  if (!companyDetails) {
    return (
      <DashboardShell>
        <h1 className="text-2xl font-bold">Company not found</h1>
        <p>No company found with the provided ID.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
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
              <TimelineContent />
            </TabsContent>
            <TabsContent value="tasks">
              <TasksContent />
            </TabsContent>
            <TabsContent value="notes">
              <NotesContent />
            </TabsContent>
            <TabsContent value="files">
              <FilesContent />
            </TabsContent>
            <TabsContent value="emails">
              <EmailsContent />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}
