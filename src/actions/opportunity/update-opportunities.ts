"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateOpportunity(
  opportunityUuid: string,
  opportunityData: { companies: number[] }
): Promise<OpportunityData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    // console.log(
    //   `Sending update request for opportunity ${opportunityUuid}:`,
    //   opportunityData
    // );

    const response = await apiClient.opportunities.update(
      opportunityUuid,
      opportunityData
    );

    // console.log("Update opportunity response:", response);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error(
        "Failed to update opportunity:",
        response.status,
        response.data
      );
      return null;
    }
  } catch (error: any) {
    console.error(
      "Error in updateOpportunity:",
      error.message,
      error.response?.data
    );
    return null;
  }
}
