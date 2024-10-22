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
  tag: z.enum(["email", "meeting", "call", "other"]),
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
          content: `${prompt} Svar alltid på norsk. Tagg hver oppgave med en av følgende: email, meeting, call, eller other.`,
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
    throw new Error(
      `Failed to generate tasks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function generateContent(
  task: z.infer<typeof TaskSchema>,
  jsonInput: string
) {
  try {
    const parsedJson = JSON.parse(jsonInput);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content:
            "Du er en assistent som hjelper med å generere innhold basert på oppgaver. Svar alltid på norsk.",
        },
        {
          role: "user",
          content: `Generer innhold for følgende oppgave: ${JSON.stringify(
            task
          )}. Bruk denne konteksten: ${JSON.stringify(parsedJson)}`,
        },
      ],
    });

    const generatedContent = completion.choices[0].message.content;
    if (!generatedContent) {
      throw new Error("No content generated");
    }
    return generatedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(
      `Failed to generate content: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
