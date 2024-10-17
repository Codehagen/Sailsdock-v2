"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updatePerson(
  personId: string,
  personData: Partial<PersonData>
): Promise<PersonData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    console.log(`Sending update request for person ${personId}:`, personData);

    const response = await apiClient.people.update(personId, personData);

    console.log("Update person response:", response);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to update person:", response.status, response.data);
      return null;
    }
  } catch (error: any) {
    console.error("Error in updatePerson:", error.message, error.response?.data);
    return null;
  }
}
