"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";

export async function getPersonDetails(
  personId: string
): Promise<PersonData | null> {
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
