import { Suspense } from "react";
import { getUserTasks } from "@/actions/tasks/get-user-tasks";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTaskSheet } from "@/components/tasks/AddTaskSheet";

export default async function TasksPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddTaskSheet />
        </div>
      </div>

      <div className="overflow-hidden">
        <Suspense fallback={<TasksSkeleton />}>
          <TasksWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function TasksWrapper() {
  const { data: tasks, totalCount, totalPages } = await getUserTasks(10, 1);

  if (tasks && tasks.length > 0) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {task.status}</p>
                <p>Type: {task.type}</p>
                <p>Due Date: {new Date(task.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <p>Total Tasks: {totalCount}</p>
          <p>Total Pages: {totalPages}</p>
        </div>
      </div>
    );
  } else {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="add" />
        <EmptyPlaceholder.Title>No tasks found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You haven't added any tasks yet. Add a task to get started.
        </EmptyPlaceholder.Description>
        <AddTaskSheet />
      </EmptyPlaceholder>
    );
  }
}

function TasksSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
