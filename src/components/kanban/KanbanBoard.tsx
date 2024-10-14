"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { BoardColumn, BoardContainer } from "./BoardColumn";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { TaskCard, Task } from "./TaskCard";
import type { Column } from "./BoardColumn";
import { hasDraggableData } from "./kanban-utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";

// Dynamically import DragOverlay to use it only on the client side
const DynamicDragOverlay = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DragOverlay),
  { ssr: false }
);

interface OpportunityData {
  id: number;
  uuid: string;
  name: string;
  status: string;
  stage: string;
  value: number;
  est_completion: string;
  user_details: {
    first_name: string;
    last_name: string;
  };
  // Add other fields as needed
}

interface KanbanBoardProps {
  opportunities: OpportunityData[];
}

const defaultCols = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In progress" },
  { id: "done", title: "Done" },
] as const;

export type ColumnId = (typeof defaultCols)[number]["id"];

export function KanbanBoard({ opportunities }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const initialTasks: Task[] = useMemo(() => {
    return opportunities.map((opp) => ({
      id: opp.uuid,
      columnId: getColumnIdFromStage(opp.stage),
      title: opp.name,
      status: opp.status,
      dueDate: opp.est_completion,
      assignee: {
        name: `${opp.user_details.first_name} ${opp.user_details.last_name}`,
      },
      arr: `${opp.value} NOK`,
      company: "", // Add company name if available in the opportunity data
      pointOfContact: "", // Add point of contact if available in the opportunity data
    }));
  }, [opportunities]);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of  ${tasksInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStatusChange = (taskId: UniqueIdentifier, newStatus: string) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });
    });
  };

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)}
              onStatusChange={handleStatusChange} // Pass the onStatusChange prop
            >
              {tasks
                .filter((task) => task.columnId === col.id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </BoardColumn>
          ))}
        </SortableContext>
      </BoardContainer>

      {isClient && (
        <DynamicDragOverlay>
          {activeColumn && (
            <BoardColumn
              isOverlay
              column={activeColumn}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              onStatusChange={handleStatusChange} // Pass the onStatusChange prop
            >
              {tasks
                .filter((task) => task.columnId === activeColumn.id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    isOverlay
                  />
                ))}
            </BoardColumn>
          )}
          {activeTask && (
            <TaskCard
              task={activeTask}
              onStatusChange={handleStatusChange}
              isOverlay
            />
          )}
        </DynamicDragOverlay>
      )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.columnId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }

  function getColumnIdFromStage(stage: string): ColumnId {
    switch (stage.toLowerCase()) {
      case "sendt tilbud":
        return "todo";
      case "følge opp":
        return "in-progress";
      default:
        return "todo";
    }
  }
}
