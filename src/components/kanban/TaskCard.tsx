"use client";

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import {
  GripVertical,
  Calendar,
  User,
  Building,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnId } from "./KanbanBoard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { useRouter } from "next/navigation";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  title: string;
  status: string;
  dueDate?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  arr?: string; // New field for ARR
  company?: string; // New field for Company
  pointOfContact?: string; // New field for Point of Contact
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
  const router = useRouter();

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

  const handleTitleClick = () => {
    router.push(`/opportunities/${task.id}`);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3 space-y-2 cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between">
          <h3
            onClick={handleTitleClick}
            className="text-sm font-medium hover:text-blue-300 cursor-pointer"
          >
            {task.title}
          </h3>
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
        {task.company && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building className="h-3 w-3" />
            <span>{task.company}</span>
          </div>
        )}
        {task.arr && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>{task.arr}</span>
          </div>
        )}
        {task.pointOfContact && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{task.pointOfContact}</span>
          </div>
        )}
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
