"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { auth } from "@clerk/nextjs/server";

export async function deleteCurrentUser(): Promise<boolean> {
  const { userId } = auth();

  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  try {
    const response = await apiClient.users.delete(userId);
    return response.success;
  } catch (error: any) {
    console.error("Error in deleteCurrentUser:", error.message);
    return false;
  }
}
