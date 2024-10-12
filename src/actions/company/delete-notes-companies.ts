"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";

export async function deleteNotesCompany(noteUuid: string): Promise<boolean> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  try {
    console.log(`Attempting to delete note with UUID: ${noteUuid}`);

    const response = await apiClient.company.notes.delete(noteUuid);

    console.log("API response:", JSON.stringify(response, null, 2));

    if (response.success) {
      return true;
    } else {
      console.error("Failed to delete note:", response.status);
      return false;
    }
  } catch (error: any) {
    console.error("Error in deleteNotesCompany:", error.message);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return false;
  }
}
