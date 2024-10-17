"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { PersonData } from "@/lib/internal-api/types";
import { getCurrentUser } from "../user/get-user-data";

export async function createPerson(
  personData: Partial<PersonData>
): Promise<PersonData | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id || !currentUser.company) {
      console.error("No user data or workspace found");
      return null;
    }

    const dataToSend = {
      ...personData,
      user: currentUser.id,
      workspace: currentUser.company,
    };

    console.log(
      "Request data being sent:",
      JSON.stringify(dataToSend, null, 2)
    );

    const response = await apiClient.people.create(dataToSend);

    if (response.success && response.data.length > 0) {
      console.log(
        "Created person data:",
        JSON.stringify(response.data[0], null, 2)
      );
      return response.data[0];
    } else {
      console.error(
        "Failed to create person:",
        response.status,
        JSON.stringify(response.data, null, 2)
      );
      return null;
    }
  } catch (error: any) {
    console.error(
      "Error in createPerson:",
      error.message,
      error.response?.data
    );
    return null;
  }
}
