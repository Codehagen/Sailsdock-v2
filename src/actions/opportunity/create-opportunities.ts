"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "../user/get-user-data";

export async function createOpportunity(
  opportunityData: Partial<OpportunityData>
): Promise<OpportunityData | null> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id || !currentUser.company) {
      console.error("No user data or workspace found");
      return null;
    }

    const dataToSend = {
      ...opportunityData,
      user: currentUser.id,
      workspace: currentUser.company,
    };

    // console.log(
    //   "Request data being sent:",
    //   JSON.stringify(dataToSend, null, 2)
    // );

    const response = await apiClient.opportunities.create(dataToSend);

    // console.log("Full API response:", JSON.stringify(response, null, 2));

    if (response.success && response.data) {
      // console.log(
      //   "Created opportunity data:",
      //   JSON.stringify(response.data[0], null, 2)
      // );
      return response.data[0];
    } else {
      console.error(
        "Failed to create opportunity:",
        response.status,
        JSON.stringify(response.data, null, 2)
      );
      return null;
    }
  } catch (error: any) {
    console.error(
      "Error in createOpportunity:",
      error.message,
      error.response?.data
    );
    return null;
  }
}
