"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "../user/get-user-data";

export async function createPerson(
  personData: Partial<PersonData>
): Promise<PersonData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error("No associated company found for the user");
      return null;
    }

    const companyId = currentUser.company_details.uuid;
    const dataToSend = {
      ...personData,
      company: currentUser.company,
    };

    const response = await apiClient.people.create(dataToSend);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to create person:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in createPerson:", error.message);
    return null;
  }
}
