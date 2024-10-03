"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { UserData } from "@/lib/internal-api/types";
import { auth } from "@clerk/nextjs/server";

export async function updateCurrentUser(
  userData: Partial<UserData>
): Promise<UserData | null> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.users.update(userId, userData);
    return response.success && response.data.length > 0
      ? response.data[0]
      : null;
  } catch (error: any) {
    console.error("Error in updateCurrentUser:", error.message);
    return null;
  }
}
