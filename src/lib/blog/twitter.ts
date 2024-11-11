import { getTweet, Tweet } from "react-tweet/api";

export async function getTweetById(id: string): Promise<Tweet | null> {
  try {
    // console.log("Fetching tweet with ID:", id);
    const tweet = await getTweet(id);
    // console.log("Fetched tweet:", tweet);
    if (!tweet || Object.keys(tweet).length === 0) {
      throw new Error("Tweet not found");
    }
    return tweet;
  } catch (error) {
    console.error("Error fetching tweet:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}
