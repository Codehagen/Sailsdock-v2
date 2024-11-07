"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { SidebarViewData } from "@/lib/internal-api/types";
import { getCurrentUser } from "../user/get-user-data";

export async function createSidebarView(
  viewData: Partial<SidebarViewData>
): Promise<SidebarViewData | null> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      console.error("No authenticated user found");
      return null;
    }

    // Prepare the data with user ID and default values
    const dataToSend: Partial<SidebarViewData> = {
      name: viewData.name || "New View",
      description: viewData.description || "",
      icon: viewData.icon || "",
      url: viewData.url || "",
      sorting: viewData.sorting || 1,
      fields: viewData.fields || null,
      user: currentUser.id,
      parent_element: viewData.parent_element || 1, // Default to section 1
    };

    // Add the view creation endpoint to the API client
    const response = await apiClient.sidebarViews.create(dataToSend);

    if (response.success && response.data.length > 0) {
      console.log("Created sidebar view:", response.data[0]);
      return response.data[0];
    } else {
      console.error("Failed to create sidebar view:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in createSidebarView:", error.message);
    return null;
  }
}
