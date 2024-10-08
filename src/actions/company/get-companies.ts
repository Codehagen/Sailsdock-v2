"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { CompanyData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

export async function getCompanies(
  pageSize: number = 10,
  page: number = 1
): Promise<{ data: CompanyData[] | null; totalCount: number }> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error(
        "No authenticated user found or user has no associated company"
      );
      return { data: null, totalCount: 0 };
    }

    const companyId = currentUser.company_details.uuid;
    const response = await apiClient.company.getAll(companyId, pageSize, page);

    if (response.success && Array.isArray(response.data)) {
      // Assuming the API returns the total count in the response
      // You might need to adjust this based on your actual API response structure
      const totalCount = response.totalCount || response.data.length;
      return { data: response.data, totalCount };
    } else {
      console.error("Companies not found:", response.status);
      return { data: null, totalCount: 0 };
    }
  } catch (error: any) {
    console.error("Error in getCompanies:", error.message);
    return { data: null, totalCount: 0 };
  }
}
