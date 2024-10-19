"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { SidebarViewData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function getSidebarData(): Promise<SidebarViewData[] | null> {
  try {
    const { userId } = auth();

    if (!userId) {
      console.error("No authenticated user found");
      return null;
    }

    const response = await apiClient.sidebarViews.getAll(userId);

    if (response.success && Array.isArray(response.data)) {
      const flattenedData = response.data.flat();
      return flattenedData;
    } else {
      console.error("Sidebar views not found:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getSidebarData:", error.message);
    return null;
  }
}
