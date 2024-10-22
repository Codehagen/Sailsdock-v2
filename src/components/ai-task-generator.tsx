"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { generateTasks } from "@/actions/generate-tasks";

interface Task {
  id: string;
  title: string;
  description: string;
}

const initialPrompt =
  "Du er en assistent som hjelper med å prioritere daglige oppgaver basert på nylig aktivitet. Svar alltid på norsk.";
const initialJsonInput = JSON.stringify(
  [
    {
      id: 3150,
      class_type: "Note",
      title: "Meeting Okt 20.11.20.24",
      description:
        "Meeting with customer Sailsdock. Christer wants me to send over a email regarding the offer.",
      date: "2024-10-21T14:39:23.965205+02:00",
    },
  ],
  null,
  2
);

export function AiTaskGenerator() {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [jsonInput, setJsonInput] = useState(initialJsonInput);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addedTasks, setAddedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTasks = async () => {
    setIsLoading(true);
    try {
      const generatedTasks = await generateTasks(prompt, jsonInput);
      if (generatedTasks) {
        setTasks(generatedTasks);
        toast.success("Oppgaver generert", {
          description: `Genererte ${generatedTasks.length} oppgaver.`,
        });
      } else {
        toast.error("Kunne ikke generere oppgaver", {
          description: "Vennligst sjekk inndata og prøv igjen.",
        });
      }
    } catch (error) {
      console.error("Feil ved generering av oppgaver:", error);
      toast.error("Kunne ikke generere oppgaver", {
        description: "Vennligst sjekk inndata og prøv igjen.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskAction = (task: Task, action: "add" | "remove") => {
    if (action === "remove") {
      setTasks(tasks.filter((t) => t.id !== task.id));
      setAddedTasks(addedTasks.filter((t) => t.id !== task.id));
      toast.success("Oppgave fjernet");
    } else {
      setAddedTasks([...addedTasks, task]);
      toast.success("Oppgave lagt til", {
        description: `Oppgave "${task.title}" lagt til i din personlige oppgaveliste`,
      });
    }
  };

  const renderTasksOrSkeleton = () => {
    if (isLoading) {
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <div key={index}>
            <div className="mb-4 flex items-center space-x-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex space-x-2 ml-auto">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
            {index < 2 && <Separator className="my-4" />}
          </div>
        ));
    }

    if (tasks.length === 0) {
      return (
        <p className="text-center text-gray-500">
          Ingen oppgaver generert ennå. Bruk skjemaet til venstre for å generere
          oppgaver.
        </p>
      );
    }

    return tasks.map((task, index) => (
      <div key={task.id}>
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex-grow">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
          <div className="flex space-x-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTaskAction(task, "add")}
            >
              Legg til
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleTaskAction(task, "remove")}
            >
              Fjern
            </Button>
          </div>
        </div>
        {index < tasks.length - 1 && <Separator className="my-4" />}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Sailsdock AI Assistent
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Oppgavegenerator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Skriv inn din forespørsel her"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Textarea
              placeholder="Skriv inn JSON-data her"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            <Button
              onClick={handleGenerateTasks}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Genererer..." : "Generer Oppgaver"}
            </Button>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Genererte Oppgaver</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {renderTasksOrSkeleton()}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Lagt til Oppgaver</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            {addedTasks.length === 0 ? (
              <p className="text-center text-gray-500">
                Ingen oppgaver lagt til ennå. Legg til oppgaver fra listen over
                genererte oppgaver.
              </p>
            ) : (
              addedTasks.map((task, index) => (
                <div key={task.id}>
                  <div className="mb-4 flex items-center space-x-4">
                    <div className="flex-grow">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleTaskAction(task, "remove")}
                    >
                      Fjern
                    </Button>
                  </div>
                  {index < addedTasks.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
