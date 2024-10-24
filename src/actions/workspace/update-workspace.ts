"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { CompanyData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateCompany(
  companyId: string,
  companyData: Partial<CompanyData>
): Promise<CompanyData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.companies.update(companyId, companyData);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to update company:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in updateCompany:", error.message);
    return null;
  }
}
