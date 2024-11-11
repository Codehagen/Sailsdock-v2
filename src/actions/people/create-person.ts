"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "../user/get-user-data";

export async function createPerson(
  personData: Partial<PersonData>
): Promise<PersonData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error("No current user found");
      return null;
    }

    // Use workspace instead of company
    const dataToSend = {
      ...personData,
      user: currentUser.id,
      workspace: currentUser.company, // Assuming 'company' field in UserData represents the workspace ID
    };
    // console.log("Data to send:", dataToSend);

    const response = await apiClient.people.create(dataToSend);

    // Log the entire response
    // console.log("API response:", JSON.stringify(response, null, 2));

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
