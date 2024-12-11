"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

interface GetUserOpportunitiesResponse {
  data: OpportunityData[] | null;
  totalCount: number;
  pagination: {
    next: string | null;
    prev: string | null;
  };
}

export async function getUserOpportunities(
  pageSize: number = 10,
  page: number = 1
): Promise<GetUserOpportunitiesResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.error("No authenticated user found");
      return {
        data: null,
        totalCount: 0,
        pagination: {
          next: null,
          prev: null,
        },
      };
    }

    const response = await apiClient.opportunities.getUserOpportunities(
      userId,
      pageSize,
      page
    );

    if (response.success && Array.isArray(response.data)) {
      return {
        data: response.data,
        totalCount: response.pagination?.count ?? response.data.length,
        pagination: {
          next: response.pagination?.next ?? null,
          prev: response.pagination?.prev ?? null,
        },
      };
    } else {
      console.error("User opportunities not found:", response.status);
      return {
        data: null,
        totalCount: 0,
        pagination: {
          next: null,
          prev: null,
        },
      };
    }
  } catch (error: any) {
    console.error("Error in getUserOpportunities:", error.message);
    return {
      data: null,
      totalCount: 0,
      pagination: {
        next: null,
        prev: null,
      },
    };
  }
}
