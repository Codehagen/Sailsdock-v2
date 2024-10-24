"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { UserData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateUserData(
  userData: Partial<UserData>
): Promise<UserData | null> {
  const { userId } = await auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.users.update(userId, userData);

    if (response.success && response.data.length > 0) {
      console.log("User data updated successfully");
      return response.data[0];
    } else {
      console.error("Failed to update user data:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in updateUserData:", error.message);
    return null;
  }
}
