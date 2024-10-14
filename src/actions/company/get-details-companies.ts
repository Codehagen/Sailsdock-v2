"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { CompanyData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function getCompanyDetails(
  companyId: string
): Promise<CompanyData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.company.getDetails(companyId);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Company not found:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getCompany:", error.message);
    return null;
  }
}
