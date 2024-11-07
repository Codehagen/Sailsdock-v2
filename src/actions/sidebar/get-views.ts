"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";
import { SidebarViewData } from "@/lib/internal-api/types";

export async function getSidebarViews(): Promise<any> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.sidebarViews.getAll(userId);

    // Log the raw response
    console.log(
      "Raw sidebar views response:",
      JSON.stringify(response, null, 2)
    );

    return response;
  } catch (error: any) {
    console.error("Error in getSidebarViews:", error.message);
    return null;
  }
}
