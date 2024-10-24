"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { TaskData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "../user/get-user-data";

export async function createTask(
  taskData: Partial<TaskData>
): Promise<TaskData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error("No current user found");
      return null;
    }

    const dataToSend = {
      ...taskData,
      user: currentUser.id,
      task_owner: currentUser.id, // Add this line to set task_owner
      workspace: currentUser.company,
    };

    const response = await apiClient.tasks.create(dataToSend);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to create task:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in createTask:", error.message);
    return null;
  }
}
