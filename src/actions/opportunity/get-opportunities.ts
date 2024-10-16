"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

export async function getOpportunities(
  pageSize: number = 10,
  page: number = 1
): Promise<{ data: OpportunityData[] | null; totalCount: number }> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error(
        "No authenticated user found or user has no associated company"
      );
      return { data: null, totalCount: 0 };
    }

    const workspaceId = currentUser.company_details.uuid;
    const response = await apiClient.opportunities.getAll(
      workspaceId,
      pageSize,
      page
    );

    if (response.success && Array.isArray(response.data)) {
      const totalCount = response.totalCount || response.data.length;
      return { data: response.data, totalCount };
    } else {
      console.error("Opportunities not found:", response.status);
      return { data: null, totalCount: 0 };
    }
  } catch (error: any) {
    console.error("Error in getOpportunities:", error.message);
    return { data: null, totalCount: 0 };
  }
}
