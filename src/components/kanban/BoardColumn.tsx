import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, Pencil } from "lucide-react";

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
  onEditStart?: (columnId: string, title: string) => void;
  isEditing?: boolean;
  editingTitle?: string;
  onEditChange?: (value: string) => void;
  onEditComplete?: (columnId: string) => void;
  onEditCancel?: () => void;
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
  onEditStart,
  isEditing,
  editingTitle,
  onEditChange,
  onEditComplete,
  onEditCancel,
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
      <div className="flex items-center justify-between p-4 bg-muted/600 rounded-t-lg">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical
            className="h-4 w-4 text-muted-foreground/50 cursor-grab"
            {...attributes}
            {...listeners}
          />
          {isEditing ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => onEditChange?.(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded bg-background"
              autoFocus
              onBlur={() => onEditComplete?.(column.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onEditComplete?.(column.id);
                if (e.key === "Escape") onEditCancel?.();
              }}
            />
          ) : (
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm font-medium">
                {column.title} ({tasks.length})
              </span>
              <button
                onClick={() => onEditStart?.(column.id, column.title)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow gap-2 p-2 overflow-y-auto">
        <SortableContext items={tasks.map((task) => task.id)}>
          {children}
        </SortableContext>
      </div>
    </div>
  );
}
