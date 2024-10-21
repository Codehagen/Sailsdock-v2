"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function getPerson(personId: string): Promise<PersonData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.people.get(personId);

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Person not found:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getPerson:", error.message);
    return null;
  }
}
