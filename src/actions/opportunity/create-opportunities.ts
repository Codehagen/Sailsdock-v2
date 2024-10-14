"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "../user/get-user-data";

export async function createOpportunity(
  opportunityData: Partial<OpportunityData>
): Promise<OpportunityData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error("No associated company found for the user");
      return null;
    }

    const workspaceId = currentUser.company_details.uuid;
    const dataToSend = {
      ...opportunityData,
      company: currentUser.company,
    };

    const response = await apiClient.opportunities.create(
      workspaceId,
      dataToSend
    );

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to create opportunity:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in createOpportunity:", error.message);
    return null;
  }
}
