"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { TaskData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function getUserTasks(
  pageSize: number = 10,
  page: number = 1
): Promise<{
  data: TaskData[] | null;
  totalCount: number;
  totalPages: number;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.error("No authenticated user found");
      return { data: null, totalCount: 0, totalPages: 0 };
    }

    const response = await apiClient.tasks.getUserTasks(userId, pageSize, page);
    // console.log(response);

    if (response.success && Array.isArray(response.data)) {
      const totalCount = response.count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);
      return {
        data: response.data,
        totalCount,
        totalPages,
      };
    } else {
      console.error("User tasks not found:", response.status);
      return { data: null, totalCount: 0, totalPages: 0 };
    }
  } catch (error: any) {
    console.error("Error in getUserTasks:", error.message);
    return { data: null, totalCount: 0, totalPages: 0 };
  }
}
