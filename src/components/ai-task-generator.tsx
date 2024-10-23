"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { generateTasks, generateContent } from "@/actions/generate-tasks";

interface Task {
  id: string;
  title: string;
  description: string;
  tag: "email" | "meeting" | "call" | "other";
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
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [generatingContentFor, setGeneratingContentFor] = useState<
    string | null
  >(null);
  const [progress, setProgress] = useState(0);

  const handleGenerateTasks = async () => {
    setIsLoading(true);
    setProgress(0);
    const interval = setInterval(
      () => setProgress((prev) => Math.min(prev + 10, 90)),
      500
    );
    try {
      const generatedTasks = await generateTasks(prompt, jsonInput);
      if (generatedTasks) {
        setTasks(generatedTasks);
        toast.success("Oppgaver generert", {
          description: `Genererte ${generatedTasks.length} oppgaver.`,
        });
      } else {
        throw new Error("No tasks generated");
      }
    } catch (error) {
      console.error("Feil ved generering av oppgaver:", error);
      toast.error("Kunne ikke generere oppgaver", {
        description:
          error instanceof Error
            ? error.message
            : "Vennligst sjekk inndata og prøv igjen.",
      });
    } finally {
      setIsLoading(false);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
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

  const handleMakeWithAI = async (task: Task) => {
    setSelectedTask(task);
    setGeneratingContentFor(task.id);
    try {
      const content = await generateContent(task, jsonInput);
      setGeneratedContent(content);
      toast.success("Innhold generert", {
        description: `Innhold generert for oppgave: ${task.title}`,
      });
    } catch (error) {
      console.error("Feil ved generering av innhold:", error);
      toast.error("Kunne ikke generere innhold", {
        description:
          error instanceof Error
            ? error.message
            : "Vennligst prøv igjen senere.",
      });
    } finally {
      setGeneratingContentFor(null);
    }
  };

  const renderTask = (task: Task, isAdded: boolean) => (
    <div key={task.id} className="mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <Badge variant="secondary" className="mt-1">
            {task.tag}
          </Badge>
        </div>
        <div className="flex space-x-2">
          {isAdded ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMakeWithAI(task)}
                disabled={generatingContentFor === task.id}
              >
                {generatingContentFor === task.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Lag med AI
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleTaskAction(task, "remove")}
              >
                Fjern
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTaskAction(task, "add")}
            >
              Legg til
            </Button>
          )}
        </div>
      </div>
      <Separator className="my-2" />
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Sailsdock AI Assistent
      </h1>
      <Tabs defaultValue="generate">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generer Oppgaver</TabsTrigger>
          <TabsTrigger value="tasks">Oppgaver</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <Card>
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
              {progress > 0 && <Progress value={progress} className="w-full" />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Genererte Oppgaver</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full pr-4">
                  {tasks.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Ingen oppgaver generert ennå. Bruk skjemaet for å generere
                      oppgaver.
                    </p>
                  ) : (
                    tasks.map((task) => renderTask(task, false))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lagt til Oppgaver</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full pr-4">
                  {addedTasks.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Ingen oppgaver lagt til ennå. Legg til oppgaver fra listen
                      over genererte oppgaver.
                    </p>
                  ) : (
                    addedTasks.map((task) => renderTask(task, true))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Generert Innhold</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                {generatedContent && selectedTask ? (
                  <>
                    <h3 className="font-semibold mb-2">
                      Innhold for: {selectedTask.title}
                    </h3>
                    <p className="whitespace-pre-wrap">{generatedContent}</p>
                  </>
                ) : (
                  <p className="text-center text-gray-500">
                    Ingen innhold generert ennå. Klikk på "Lag med AI" for en
                    oppgave for å generere innhold.
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
