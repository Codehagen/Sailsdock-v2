"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";

export async function deletePerson(personId: string): Promise<boolean> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  try {
    const response = await apiClient.people.delete(personId);

    if (response.success) {
      return true;
    } else {
      console.error("Failed to delete person:", response.status);
      return false;
    }
  } catch (error: any) {
    console.error("Error in deletePerson:", error.message);
    return false;
  }
}
