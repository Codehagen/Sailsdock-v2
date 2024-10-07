"use client";

import React, { useState } from "react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Paperclip,
  Link,
  Users,
  Building2,
  Globe,
  CheckSquare,
  Rocket,
  Linkedin,
} from "lucide-react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TimelineItem {
  id: string;
  action: string;
  details?: string;
  timestamp: string;
  icon:
    | "task"
    | "link"
    | "company"
    | "employees"
    | "domain"
    | "status"
    | "creation";
  user: string;
  showInBox?: boolean; // New property to determine if the item should be shown in the box
}

const iconMap = {
  task: Paperclip,
  link: Link,
  company: Building2,
  employees: Users,
  domain: Globe,
  status: CheckSquare,
  creation: Rocket, // Add this line
};

function TimelineIcon({ type }: { type: keyof typeof iconMap }) {
  const Icon = iconMap[type];
  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </div>
  );
}

export function TimelineContent() {
  const [hasTimelineItems, setHasTimelineItems] = useState(true);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: "1",
      action: "oppdaterte en relatert oppgave Uten tittel",
      timestamp: "2024-10-06T10:00:00Z",
      icon: "task",
      user: "Christer",
    },
    {
      id: "2",
      action: "oppdaterte ICP → ✗ Usann",
      timestamp: "2024-10-05T14:30:00Z",
      icon: "status",
      user: "Vegard",
    },
    {
      id: "3",
      action: "oppdaterte felt på Vegard Enterprises",
      details: "Linkedin → sailsdock.no",
      timestamp: "2024-10-05T09:00:00Z",
      icon: "company",
      user: "Steffen",
      showInBox: true,
    },
    {
      id: "4",
      action: "oppdaterte felt på Vegard Enterprises",
      details: "ARR → 1.000.000 NOK",
      timestamp: "2024-10-05T09:00:00Z",
      icon: "company",
      user: "Steffen",
      showInBox: true,
    },
    {
      id: "5",
      action: "oppdaterte felt på Vegard Enterprises",
      details: "ARR → 1.000.000 NOK",
      timestamp: "2024-10-02T09:00:00Z",
      icon: "company",
      user: "Steffen",
      showInBox: true,
    },
    {
      id: "creation",
      action: "Propdock ble laget",
      timestamp: "2024-01-01T00:00:00Z",
      icon: "creation",
      user: "Vegard",
    },
  ]);

  if (!hasTimelineItems) {
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
    const date = format(parseISO(item.timestamp), "MMMM yyyy", { locale: nb });
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
        {Object.entries(groupedItems).map(([date, dateItems], groupIndex) => {
          // Group items by date and user
          const groupedByDateAndUser = dateItems.reduce((acc, item) => {
            const key = `${format(parseISO(item.timestamp), "yyyy-MM-dd")}-${
              item.user
            }`;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          }, {} as Record<string, TimelineItem[]>);

          return (
            <div key={date} className="mb-8">
              <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                {date}
              </h2>
              <ul className="space-y-4 relative">
                <div
                  className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700 z-0"
                  aria-hidden="true"
                />
                {Object.entries(groupedByDateAndUser).map(
                  ([dateUserKey, items]) => {
                    const boxItems = items.filter((item) => item.showInBox);
                    const nonBoxItems = items.filter((item) => !item.showInBox);

                    return (
                      <React.Fragment key={dateUserKey}>
                        {nonBoxItems.map((item) => (
                          <li key={item.id} className="relative pl-10">
                            {/* Render non-box items */}
                            <div className="absolute left-0 top-0.5">
                              <TimelineIcon type={item.icon} />
                            </div>
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  {item.id === "creation" ? (
                                    <>
                                      {item.action} av{" "}
                                      <span className="font-medium">
                                        {item.user}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="font-medium">
                                        {item.user}
                                      </span>{" "}
                                      {item.action}
                                    </>
                                  )}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground ml-4 whitespace-nowrap">
                                {formatDistanceToNow(parseISO(item.timestamp), {
                                  addSuffix: true,
                                  locale: nb,
                                })}
                              </p>
                            </div>
                          </li>
                        ))}
                        {boxItems.length > 0 && (
                          <>
                            <li className="relative pl-10 z-10">
                              <div className="absolute left-0 top-0.5">
                                <TimelineIcon type={boxItems[0].icon} />
                              </div>
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col space-y-1">
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">
                                      {boxItems[0].user}
                                    </span>{" "}
                                    oppdaterte {boxItems.length} felt på{" "}
                                    {boxItems[0].action.split(" på ")[1]}
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground ml-4 whitespace-nowrap">
                                  {formatDistanceToNow(
                                    parseISO(boxItems[0].timestamp),
                                    {
                                      addSuffix: true,
                                      locale: nb,
                                    }
                                  )}
                                </p>
                              </div>
                            </li>
                            <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-muted-foreground relative z-10">
                              {boxItems.flatMap((item) =>
                                item.details
                                  ? item.details
                                      .split("\n")
                                      .map((detail, index) => {
                                        const [key, value] = detail
                                          .split("→")
                                          .map((s) => s.trim());
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
                                            return null;
                                        }
                                        return (
                                          <div
                                            key={`${item.id}-${index}`}
                                            className="flex items-center mb-1 last:mb-0"
                                          >
                                            <Icon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                            <span className="font-medium mr-2">
                                              {key}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                              →
                                            </span>
                                            <span className="ml-2 bg-white dark:bg-gray-700 px-2 py-0.5 rounded">
                                              {value}
                                            </span>
                                          </div>
                                        );
                                      })
                                  : []
                              )}
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </ul>
            </div>
          );
        })}
        {/* For testing purposes */}
        <Button
          onClick={() => setHasTimelineItems(!hasTimelineItems)}
          className="mt-4"
        >
          Toggle Timeline Items
        </Button>
      </CardContent>
    </Card>
  );
}
