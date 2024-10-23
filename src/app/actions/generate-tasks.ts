"use server";

import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

const TasksResponseSchema = z.array(TaskSchema);

export async function generateTasks(prompt: string, jsonInput: string) {
  try {
    const parsedJson = JSON.parse(jsonInput);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `Here is the recent timeline data: ${JSON.stringify(
            parsedJson
          )}`,
        },
      ],
      functions: [
        {
          name: "generate_tasks",
          description:
            "Generate a list of prioritized tasks based on the recent timeline data",
          parameters: {
            type: "object",
            properties: {
              tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["id", "title", "description"],
                },
              },
            },
            required: ["tasks"],
          },
        },
      ],
      function_call: { name: "generate_tasks" },
    });

    const generatedTasks = JSON.parse(
      response.choices[0].message.function_call?.arguments || "{}"
    );
    const validatedTasks = TasksResponseSchema.parse(generatedTasks.tasks);

    return validatedTasks;
  } catch (error) {
    console.error("Error generating tasks:", error);
    throw new Error("Failed to generate tasks");
  }
}
