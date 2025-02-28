"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { WorkspaceData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function createCompany(
  companyData: Partial<WorkspaceData>
): Promise<WorkspaceData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.workspaces.create(companyData);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to create company:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in createCompany:", error.message);
    return null;
  }
}
