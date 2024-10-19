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
    console.log("Attempting to get user with ID:", userId);
    const response = await apiClient.users.get(userId);

    // Log the full response, regardless of success or failure
    console.log("Full get user response:", JSON.stringify(response, null, 2));

    if (response.success && response.data.length > 0) {
      console.log("User found in database");
      return response.data[0];
    }

    // If we reach here, it means the user was not found, so we'll try to create one
    console.log("User not found in database. Attempting to create...");
    const newUserData: Partial<UserData> = {
      clerk_id: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      username: clerkUser.username || undefined,
      first_name: clerkUser.firstName || "",
      last_name: clerkUser.lastName || "",
    };

    console.log("New user data:", JSON.stringify(newUserData, null, 2));

    const createResponse = await apiClient.users.create(newUserData);

    // Log the full create response, regardless of success or failure
    console.log(
      "Full create user response:",
      JSON.stringify(createResponse, null, 2)
    );

    if (createResponse.success && createResponse.data.length > 0) {
      console.log("New user created successfully");
      return createResponse.data[0];
    } else {
      console.error(
        "Failed to create user. Full response:",
        JSON.stringify(createResponse, null, 2)
      );
      return null;
    }
  } catch (error: any) {
    console.error("Error in getCurrentUser:");
    logDetailedError(error);
    return null;
  }
}

function logDetailedError(error: any) {
  console.error("Error object:", error);
  if (error.response) {
    console.error("Response status:", error.response.status);
    console.error(
      "Response data:",
      JSON.stringify(error.response.data, null, 2)
    );
    console.error("Response headers:", error.response.headers);
  } else if (error.request) {
    console.error("Request:", error.request);
  } else {
    console.error("Error message:", error.message);
  }
  console.error("Error stack:", error.stack);
}
