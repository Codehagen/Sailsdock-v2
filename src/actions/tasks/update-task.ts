"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { TaskData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateTask(
  taskId: string,
  taskData: Partial<TaskData>
): Promise<TaskData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    console.log("Updating task with data:", {
      taskId,
      taskData,
    });

    const response = await apiClient.tasks.update(taskId, taskData);

    console.log("API Response:", response);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to update task:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in updateTask:", error.message);
    return null;
  }
}
