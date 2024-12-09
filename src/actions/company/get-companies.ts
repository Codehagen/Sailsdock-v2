"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { CompanyData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

export async function getCompanies(
  pageSize: number = 10,
  page: number = 1,
  search?: string
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
    const response = search
      ? await apiClient.company.search(companyId, search, pageSize, page)
      : await apiClient.company.getAll(companyId, pageSize, page);

    if (response.success && Array.isArray(response.data)) {
      const totalCount = response.pagination?.count ?? response.data.length;
      return { data: response.data, totalCount };
    }

    console.error("Companies not found:", response.status);
    return { data: null, totalCount: 0 };
  } catch (error: any) {
    console.error("Error in getCompanies:", error.message);
    return { data: null, totalCount: 0 };
  }
}
