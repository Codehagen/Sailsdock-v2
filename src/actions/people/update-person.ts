"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updatePerson(
  personId: string,
  personData: Partial<PersonData>
): Promise<PersonData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.people.update(personId, personData);
    console.log("updatePerson response", response);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to update person:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in updatePerson:", error.message);
    return null;
  }
}
