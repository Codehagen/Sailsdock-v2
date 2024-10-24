"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskDetailsData } from "@/lib/internal-api/types";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

interface TaskUserDetailsProps {
  taskDetails: TaskDetailsData;
}

export function TaskUserDetails({ taskDetails }: TaskUserDetailsProps) {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "d. MMMM yyyy", { locale: nb });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {taskDetails.title}
            </h3>
            <span className="block text-xs text-muted-foreground mt-1">
              Created on {formatDate(taskDetails.date_created)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Status:
            </span>
            <span className="text-sm text-muted-foreground">
              {taskDetails.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Type:
            </span>
            <span className="text-sm text-muted-foreground">
              {taskDetails.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Due Date:
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDate(taskDetails.date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Description:
            </span>
            <span className="text-sm text-muted-foreground">
              {taskDetails.description || "No description"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
