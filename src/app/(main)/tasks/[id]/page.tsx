import { DashboardShell } from "@/components/shell/shell";
import { getTaskDetails } from "@/actions/tasks/get-task-details";
import { TaskUserDetails } from "@/components/task-user/TaskUserDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, FileText } from "lucide-react";
import { TimelineContent } from "@/components/company/TimelineContent";
import { NotesContent } from "@/components/company/NotesContent";

export default async function TaskPage({ params }: { params: { id: string } }) {
  const taskId = params.id;
  const taskDetails = await getTaskDetails(taskId);

  if (!taskDetails) {
    return (
      <DashboardShell>
        <h1 className="text-2xl font-bold">Task not found</h1>
        <p>No task found with the provided ID.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TaskUserDetails taskDetails={taskDetails} />
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <TimelineContent timelineItems={taskDetails.timeline || []} />
            </TabsContent>
            <TabsContent value="notes">
              <NotesContent
                notes={taskDetails.notes || []}
                taskId={taskDetails.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}
