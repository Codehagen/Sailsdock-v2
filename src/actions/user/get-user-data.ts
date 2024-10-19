"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { UserData } from "@/lib/internal-api/types";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser(): Promise<UserData | null> {
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    console.error("No authenticated user found");
    return null;
  }

  try {
    const response = await apiClient.users.get(userId);

    if (response.success && response.data.length > 0) {
      console.log("User found in database");
      return response.data[0];
    }

    console.log("User not found in database. Attempting to create...");
    const newUserData: Partial<UserData> = {
      clerk_id: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      username: clerkUser.username || undefined,
      first_name: clerkUser.firstName || "",
      last_name: clerkUser.lastName || "",
    };

    const createResponse = await apiClient.users.create(newUserData);

    if (createResponse.success && createResponse.data.length > 0) {
      console.log("New user created successfully");
      return createResponse.data[0];
    } else {
      console.error("Failed to create user:", createResponse.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getCurrentUser:", error.message);
    return null;
  }
}
