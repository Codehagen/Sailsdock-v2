"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { TaskDetailsData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function getTaskDetails(
  taskId: string
): Promise<TaskDetailsData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.tasks.getDetails(taskId);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Task not found:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getTaskDetails:", error.message);
    return null;
  }
}
