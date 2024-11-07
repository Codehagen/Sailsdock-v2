"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";

export async function updateSidebarView(
  viewId: string,
  data: { name?: string }
): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("No authenticated user found");
      return false;
    }

    const response = await apiClient.sidebarViews.update(viewId, data);

    if (response.success) {
      return true;
    }

    console.error("Failed to update view:", response);
    return false;
  } catch (error) {
    console.error("Error updating sidebar view:", error);
    return false;
  }
}
