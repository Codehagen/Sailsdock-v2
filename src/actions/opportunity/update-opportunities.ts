"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateOpportunity(
  opportunityUuid: string,
  opportunityData: Partial<OpportunityData>
): Promise<OpportunityData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    // Ensure companies array contains valid numbers
    if (opportunityData.companies) {
      opportunityData.companies = opportunityData.companies
        .filter(id => typeof id === 'number' && !isNaN(id))
        .map(id => Number(id));
    }

    const response = await apiClient.opportunities.update(
      opportunityUuid,
      opportunityData
    );

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to update opportunity:", response.status);
      if (response.data) {
        console.error("Error details:", JSON.stringify(response.data, null, 2));
      }
      return null;
    }
  } catch (error: any) {
    console.error("Error in updateOpportunity:", error.message);
    if (error.response?.data) {
      console.error("API error details:", JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}
