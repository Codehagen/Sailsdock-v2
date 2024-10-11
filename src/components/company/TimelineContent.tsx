"use client";

import React from "react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Paperclip,
  Mail,
  MessageSquare,
  CheckSquare,
  FileText,
} from "lucide-react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  class_type: string;
  user_details: {
    first_name: string;
    last_name: string;
  };
  date_created: string;
  title: string;
  description: string;
  status: string;
  date: string;
  type: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  email: Mail,
  sms: MessageSquare,
  Task: CheckSquare,
  ContactNote: FileText,
};

function TimelineIcon({ type }: { type: string }) {
  const Icon = iconMap[type] || Paperclip;
  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </div>
  );
}

export function TimelineContent({
  timelineItems,
}: {
  timelineItems: TimelineItem[];
}) {
  if (!timelineItems || timelineItems.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="search" />
        <EmptyPlaceholder.Title>
          Ingen tidslinjeelementer
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Det er ingen tidslinjeelementer å vise for dette selskapet ennå.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  const groupedItems = timelineItems.reduce((acc, item) => {
    const date = format(parseISO(item.date_created), "MMMM yyyy", {
      locale: nb,
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, TimelineItem[]>);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tidslinje</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(groupedItems).map(([date, dateItems]) => (
          <div key={date} className="mb-8">
            <h2 className="text-lg font-semibold text-muted-foreground mb-4">
              {date}
            </h2>
            <ul className="space-y-4 relative">
              <div
                className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700 z-0"
                aria-hidden="true"
              />
              {dateItems.map((item) => (
                <li key={item.id} className="relative pl-10">
                  <div className="absolute left-0 top-0.5">
                    <TimelineIcon type={item.type || item.class_type} />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">
                          {`${item.user_details.first_name} ${item.user_details.last_name}`}
                        </span>{" "}
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground ml-4 whitespace-nowrap">
                      {formatDistanceToNow(parseISO(item.date_created), {
                        addSuffix: true,
                        locale: nb,
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
