"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function getOpportunityDetails(
  opportunityId: string
): Promise<OpportunityData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.opportunities.getDetails(opportunityId);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Opportunity not found:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getOpportunityDetails:", error.message);
    return null;
  }
}
