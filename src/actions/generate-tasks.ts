"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

const TasksResponseSchema = z.object({
  tasks: z.array(TaskSchema),
});

export async function generateTasks(prompt: string, jsonInput: string) {
  try {
    const parsedJson = JSON.parse(jsonInput);

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `${prompt} Svar alltid på norsk.`,
        },
        {
          role: "user",
          content: `Generer oppgaver basert på følgende tidslinjedata: ${JSON.stringify(
            parsedJson
          )}`,
        },
      ],
      response_format: zodResponseFormat(TasksResponseSchema, "tasks_response"),
    });

    const tasksResponse = completion.choices[0].message.parsed;
    return tasksResponse?.tasks;
  } catch (error) {
    console.error("Error generating tasks:", error);
    throw new Error("Failed to generate tasks");
  }
}
