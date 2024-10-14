"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateOpportunity(
  opportunityId: string,
  opportunityData: Partial<OpportunityData>
): Promise<OpportunityData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.opportunities.update(
      opportunityId,
      opportunityData
    );

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to update opportunity:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in updateOpportunity:", error.message);
    return null;
  }
}
