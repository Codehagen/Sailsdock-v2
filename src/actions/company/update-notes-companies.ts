"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { NoteData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateNotesCompany(
  noteUuid: string,
  noteData: Partial<NoteData> & { clientDate?: string }
): Promise<NoteData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    console.log(`Attempting to update note with UUID: ${noteUuid}`);

    const updatedNoteData = {
      ...noteData,
      date: noteData.clientDate || new Date().toISOString(),
    };

    console.log("Update data:", JSON.stringify(updatedNoteData, null, 2));

    const response = await apiClient.company.notes.update(
      noteUuid,
      updatedNoteData
    );

    console.log("API response:", JSON.stringify(response, null, 2));

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to update note:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in updateNotesCompany:", error.message);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return null;
  }
}
