"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { CompanyData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "../user/get-user-data";

export async function createCompany(
  companyData: Partial<CompanyData>
): Promise<CompanyData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const currentUser = await getCurrentUser();
    console.log("Current user:", currentUser);
    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error("No associated company found for the user");
      return null;
    }

    const companyId = currentUser.company_details.uuid;
    const dataToSend = {
      ...companyData,
      company: currentUser.company,
    };
    console.log("Data to send:", dataToSend);

    const response = await apiClient.company.create(companyId, dataToSend);

    // Log the entire response
    console.log("API response:", JSON.stringify(response, null, 2));

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to create company:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in createCompany:", error.message);
    return null;
  }
}
