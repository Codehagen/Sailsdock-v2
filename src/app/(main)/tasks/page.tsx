import { Suspense } from "react";
import { getUserTasks } from "@/actions/tasks/get-user-tasks";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddTaskSheet } from "@/components/tasks/AddTaskSheet";
import { TaskTable } from "@/components/tasks/task-table/data-table";
import { columns } from "@/components/tasks/task-table/columns";

export default async function TasksPage() {
  const { data: initialTasks, totalCount } = await getUserTasks(10, 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddTaskSheet />
        </div>
      </div>

      <div className="overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          {initialTasks && initialTasks.length > 0 ? (
            <TaskTable
              columns={columns}
              initialData={initialTasks}
              initialTotalCount={totalCount}
            />
          ) : (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="add" />
              <EmptyPlaceholder.Title>No tasks found</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                You haven't added any tasks yet. Add a task to get started.
              </EmptyPlaceholder.Description>
              <AddTaskSheet />
            </EmptyPlaceholder>
          )}
        </Suspense>
      </div>
    </div>
  );
}
