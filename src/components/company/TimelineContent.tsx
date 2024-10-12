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
  Calendar,
  Phone,
  Users,
  Globe,
  Building2,
  Linkedin,
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
  // showInBox?: boolean; // Uncomment when implementing box feature
}

const iconMap: { [key: string]: React.ElementType } = {
  email: Mail,
  sms: MessageSquare,
  Task: CheckSquare,
  ContactNote: FileText,
  document: FileText,
  calendar: Calendar,
  call: Phone,
};

function TimelineIcon({
  type,
  classType,
}: {
  type: string;
  classType: string;
}) {
  let Icon = iconMap[type] || iconMap[classType] || Paperclip;
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
                    <TimelineIcon
                      type={item.type}
                      classType={item.class_type}
                    />
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
              {/* Commented out box feature for future implementation
              {boxItems.length > 0 && (
                <>
                  <li className="relative pl-10 z-10">
                    <div className="absolute left-0 top-0.5">
                      <TimelineIcon type={boxItems[0].type} classType={boxItems[0].class_type} />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">
                            {`${boxItems[0].user_details.first_name} ${boxItems[0].user_details.last_name}`}
                          </span>{" "}
                          oppdaterte {boxItems.length} felt
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground ml-4 whitespace-nowrap">
                        {formatDistanceToNow(parseISO(boxItems[0].date_created), {
                          addSuffix: true,
                          locale: nb,
                        })}
                      </p>
                    </div>
                  </li>
                  <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-muted-foreground relative z-10">
                    {boxItems.map((item, index) => {
                      if (!item.description) return null;
                      const [key, value] = item.description.split("→").map((s) => s.trim());
                      let Icon;
                      switch (key.toLowerCase()) {
                        case "employees":
                          Icon = Users;
                          break;
                        case "domain name":
                          Icon = Globe;
                          break;
                        case "linkedin":
                          Icon = Linkedin;
                          break;
                        case "arr":
                          Icon = Building2;
                          break;
                        default:
                          Icon = Paperclip;
                      }
                      return (
                        <div key={`${item.id}-${index}`} className="flex items-center mb-1 last:mb-0">
                          <Icon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium mr-2">{key}</span>
                          <span className="text-gray-500 dark:text-gray-400">→</span>
                          <span className="ml-2 bg-white dark:bg-gray-700 px-2 py-0.5 rounded">
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              */}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
