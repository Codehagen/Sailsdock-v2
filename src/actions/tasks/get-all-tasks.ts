"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { TaskData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

export async function getAllTasks(
  pageSize: number = 10,
  page: number = 1
): Promise<{
  data: TaskData[] | null;
  totalCount: number;
  totalPages: number;
}> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error(
        "No authenticated user found or user has no associated company"
      );
      return { data: null, totalCount: 0, totalPages: 0 };
    }

    const workspaceId = currentUser.company_details.uuid;
    const response = await apiClient.tasks.getAll(workspaceId, pageSize, page);

    if (response.success && Array.isArray(response.data)) {
      const totalCount = response.count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);
      return {
        data: response.data,
        totalCount,
        totalPages,
      };
    } else {
      console.error("Tasks not found:", response.status);
      return { data: null, totalCount: 0, totalPages: 0 };
    }
  } catch (error: any) {
    console.error("Error in getAllTasks:", error.message);
    return { data: null, totalCount: 0, totalPages: 0 };
  }
}
