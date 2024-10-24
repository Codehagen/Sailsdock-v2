"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export async function getClerkUser() {
  const { userId } = await auth();

  if (!userId) {
    console.error("No user is currently logged in.");
    return null;
  }

  const user = await currentUser();

  // Here you can add any additional user-related data fetching
  // For example, querying your database for user-specific information
  // const userDbInfo = await db.user.findUnique({ where: { clerkId: userId } })

  return {
    id: userId,
    name: user?.firstName,
    email: user?.emailAddresses[0]?.emailAddress,
    // ...any other fields you want to include
    // ...userDbInfo
  };
}
