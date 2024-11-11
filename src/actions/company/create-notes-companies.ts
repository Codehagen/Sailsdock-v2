"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { NoteData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "../user/get-user-data";

export async function createNotesCompany(noteData: {
  title: string;
  description: string;
  customer: number;
}): Promise<NoteData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const currentUser = await getCurrentUser();
    // console.log("Current user:", currentUser);
    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error("No associated company found for the user");
      return null;
    }

    const dataToSend: Partial<NoteData> = {
      title: noteData.title,
      description: noteData.description,
      customer: noteData.customer,
      company: currentUser.company,
      class_type: "ContactNote",
      status: "completed",
      type: "notes",
      user: currentUser.id,
    };
    // console.log("Data to send:", dataToSend);

    const response = await apiClient.company.notes.create(dataToSend);

    // Log the entire response
    // console.log("API response:", JSON.stringify(response, null, 2));

    if (response.success && response.data.length > 0) {
      return response.data[0];
    } else {
      console.error("Failed to create note:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in createNotesCompany:", error.message);
    return null;
  }
}
