"use server";

import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  feedback: z.string().min(10),
});

export async function sendFeedback(formData: FormData) {
  const validatedFields = feedbackSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    feedback: formData.get("feedback"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid form data" };
  }

  const { name, email, feedback } = validatedFields.data;

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Discord webhook URL is not set");
    return { error: "Server configuration error" };
  }

  const currentDate = new Date().toLocaleString("no-NO", {
    timeZone: "Europe/Oslo",
  });

  const message = {
    content: `Feedback fra ${name}`,
    embeds: [
      {
        title: "Ny tilbakemelding",
        fields: [
          { name: "Navn", value: name },
          { name: "E-post", value: email },
          { name: "Melding", value: feedback },
          { name: "Dato", value: currentDate },
        ],
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Failed to send feedback");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending feedback:", error);
    return { error: "Failed to send feedback" };
  }
}
