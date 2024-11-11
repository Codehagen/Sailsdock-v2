"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { WorkspaceData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

export async function getWorkspaceUsers(): Promise<WorkspaceData[] | null> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error(
        "No authenticated user found or user has no associated company"
      );
      return null;
    }

    const workspaceId = currentUser.company_details.uuid;
    const response = await apiClient.workspaces.getUsers(workspaceId);
    // console.log("API response:", response);

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch workspace users:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getWorkspaceUsers:", error.message);
    return null;
  }
}
