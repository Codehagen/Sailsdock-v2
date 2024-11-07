import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";

export interface Column {
  id: string;
  title: string;
}

interface BoardColumnProps {
  column: Column;
  children: React.ReactNode;
  isOverlay?: boolean;
  tasks: any[];
  onStatusChange: (taskId: string, newStatus: string) => void;
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4 p-4 overflow-x-auto">
      {children}
    </div>
  );
}

export function BoardColumn({
  column,
  children,
  isOverlay,
  tasks,
}: BoardColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("w-[350px] flex flex-col rounded-lg bg-muted/50", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-4 bg-muted/60 rounded-t-lg"
      >
        <h3 className="text-sm font-medium">
          {column.title} ({tasks.length})
        </h3>
        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
      </div>

      <div className="flex flex-col flex-grow gap-2 p-2 overflow-y-auto">
        <SortableContext items={tasks.map((task) => task.id)}>
          {children}
        </SortableContext>
      </div>
    </div>
  );
}