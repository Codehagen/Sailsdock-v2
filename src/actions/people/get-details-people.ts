"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function getPersonDetails(
  personId: string
): Promise<PersonData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.people.getDetails(personId);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Person not found:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getPersonDetails:", error.message);
    return null;
  }
}
