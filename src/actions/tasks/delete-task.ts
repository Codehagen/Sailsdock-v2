"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";

export async function deleteTask(taskId: string): Promise<boolean> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  try {
    const response = await apiClient.tasks.delete(taskId);

    if (response.success) {
      return true;
    } else {
      console.error("Failed to delete task:", response.status);
      return false;
    }
  } catch (error: any) {
    console.error("Error in deleteTask:", error.message);
    return false;
  }
}
