import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnId } from "./KanbanBoard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

export interface Task {
  [x: string]: any;
  id: UniqueIdentifier;
  columnId: ColumnId;
  title: string;
  status: string;
  dueDate?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
}

export interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: UniqueIdentifier, newStatus: string) => void;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, onStatusChange, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  };

  // Add a function to handle status change
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task.id, newStatus);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{task.title}</h3>
          <Button
            variant="ghost"
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 h-auto cursor-grab"
          >
            <span className="sr-only">Move task</span>
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs font-normal">
            {task.status}
          </Badge>
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span title={task.dueDate}>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        {task.assignee && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px]">
                {task.assignee.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{task.assignee.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}