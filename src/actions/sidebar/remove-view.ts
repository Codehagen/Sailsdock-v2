"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";

export async function removeSidebarView(viewId: string): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("No authenticated user found");
      return false;
    }

    const response = await apiClient.sidebarViews.delete(viewId);

    if (response.success) {
      return true;
    }

    console.error("Failed to remove view:", response);
    return false;
  } catch (error) {
    console.error("Error removing sidebar view:", error);
    return false;
  }
}
