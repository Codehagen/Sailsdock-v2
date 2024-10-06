import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddTaskSheet } from "./AddTaskSheet";

export function TasksContent() {
  const hasTasks = false; // This should be replaced with actual data check

  if (!hasTasks) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="checkSquare" />
        <EmptyPlaceholder.Title>Ingen oppgaver ennå</EmptyPlaceholder.Title>
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
        <h2 className="text-xl font-bold">Oppgaver</h2>
        <AddTaskSheet />
      </div>
      <p>Oppgaveinnhold</p> {/* Replace with actual tasks content */}
    </div>
  );
}
