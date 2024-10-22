"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

export async function getAllPeople(
  pageSize: number = 10,
  page: number = 1
): Promise<{
  data: PersonData[] | null;
  totalCount: number;
  totalPages: number;
}> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error(
        "No authenticated user found or user has no associated company"
      );
      return { data: null, totalCount: 0, totalPages: 0 };
    }

    const companyId = currentUser.company_details.uuid;
    const response = await apiClient.people.getAll(companyId, pageSize, page);

    if (response.success && Array.isArray(response.data)) {
      const totalCount = response.count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);
      return {
        data: response.data,
        totalCount,
        totalPages,
      };
    } else {
      console.error("People not found:", response.status);
      return { data: null, totalCount: 0, totalPages: 0 };
    }
  } catch (error: any) {
    console.error("Error in getAllPeople:", error.message);
    return { data: null, totalCount: 0, totalPages: 0 };
  }
}
