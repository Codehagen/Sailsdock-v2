"use client";
import { useState } from "react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddTaskSheet } from "./AddTaskSheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  company: string;
}

export function TasksContent() {
  const [hasTasks, setHasTasks] = useState(true); // Toggle this for testing
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Task title",
      completed: false,
      company: "Vegard Enterprises",
    },
    {
      id: "2",
      title: "Another task",
      completed: false,
      company: "Vegard Enterprises",
    },
  ]);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (!hasTasks) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="checkSquare" />
        <EmptyPlaceholder.Title>Ingen oppgaver</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Opprett din første oppgave for dette selskapet.
        </EmptyPlaceholder.Description>
        <AddTaskSheet />
      </EmptyPlaceholder>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">TODO {tasks.length}</h2>
        <AddTaskSheet />
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
              />
              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{task.company}</span>
              <Button variant="ghost" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {/* For testing purposes */}
      <Button onClick={() => setHasTasks(!hasTasks)} className="mt-4">
        Toggle Tasks
      </Button>
    </div>
  );
}
