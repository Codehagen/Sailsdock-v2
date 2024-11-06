"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { Task } from "@/components/tasks/task-table/types";
import { auth } from "@clerk/nextjs/server";

export async function updateTask(
  taskId: string,
  taskData: Partial<Task>
): Promise<Task | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.tasks.update(taskId, taskData);

    if (response.success && response.data?.[0]) {
      return response.data[0];
    }

    console.error("Failed to update task:", response);
    return null;
  } catch (error: any) {
    console.error("Error in updateTask:", error.message);
    return null;
  }
}
