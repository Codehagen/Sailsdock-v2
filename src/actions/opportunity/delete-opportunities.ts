"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";

export async function deleteOpportunity(
  opportunityId: string
): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  try {
    const response = await apiClient.opportunities.delete(opportunityId);

    if (response.success) {
      return true;
    } else {
      console.error("Failed to delete opportunity:", response.status);
      return false;
    }
  } catch (error: any) {
    console.error("Error in deleteOpportunity:", error.message);
    return false;
  }
}
