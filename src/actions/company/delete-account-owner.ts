"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";
import { CompanyData, AccountOwner } from "@/lib/internal-api/types";

export async function removeAccountOwner(
  companyUuid: string,
  accountOwnerIdToRemove: number
): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  try {
    // console.log(
    //  `Attempting to remove account owner with ID: ${accountOwnerIdToRemove} from company: ${companyUuid}`
    // );

    // First, get the current company details
    const companyResponse = await apiClient.company.getDetails(companyUuid);

    if (!companyResponse.success || companyResponse.data.length === 0) {
      console.error("Failed to fetch company details");
      return false;
    }

    const company = companyResponse.data[0] as CompanyData;

    // Filter out the account owner to be removed and only keep the IDs
    const updatedAccountOwnerIds = (company.account_owners as AccountOwner[])
      .filter((owner) => owner.id !== accountOwnerIdToRemove)
      .map((owner) => owner.id);

    // Prepare the update data
    const updateData: Partial<CompanyData> = {
      account_owners: updatedAccountOwnerIds,
    };

    // Update the company with the new account owners list (only IDs)
    const updateResponse = await apiClient.company.update(
      companyUuid,
      updateData
    );

    if (updateResponse.success) {
      // console.log("Account owner removed successfully");
      return true;
    } else {
      console.error("Failed to update company:", updateResponse.status);
      return false;
    }
  } catch (error: any) {
    console.error("Error in removeAccountOwner:", error.message);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return false;
  }
}
