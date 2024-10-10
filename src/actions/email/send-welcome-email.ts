"use server";

import { Resend } from "resend";
import EmailTemplate from "@/components/email/email-template";
import { getCurrentUser } from "../user/get-user-data";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      return {
        success: false,
        message: "User not found or email not available",
      };
    }

    const { first_name, email } = user;

    const result = await resend.emails.send({
      from: "Sailsdock <no-reply@sailsdock.com>",
      to: email,
      subject: "Velkommen til Sailsdock!",
      react: EmailTemplate({
        userName: first_name || "Bruker",
        actionUrl: "https://sailsdock.com/kom-i-gang",
      }) as React.ReactElement,
    });

    if (result.error) {
      console.error("Failed to send email:", result.error);
      return { success: false, message: "Failed to send welcome email" };
    }

    return { success: true, message: "Welcome email sent successfully" };
  } catch (error: any) {
    console.error("Error in sendWelcomeEmail:", error.message);
    return {
      success: false,
      message: "An error occurred while sending the welcome email",
    };
  }
}
