"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { CompanyData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function deleteCompany(companyId: string): Promise<boolean> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  try {
    const response = await apiClient.companies.delete(companyId);
    return response.success;
  } catch (error: any) {
    console.error("Error in deleteCompany:", error.message);
    return false;
  }
}
