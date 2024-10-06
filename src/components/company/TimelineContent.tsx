"use client";

import { useState } from "react";
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
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-600" />
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
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tidslinje</h2>
      </div>
      {Object.entries(groupedItems).map(([date, dateItems], groupIndex) => {
        const allDetailsForDay = dateItems
          .filter((item) => item.showInBox)
          .flatMap((item) => (item.details ? item.details.split("\n") : []));

        // Group actions by user for items that should be shown in the box
        const groupedActions = dateItems.reduce((acc, item) => {
          if (item.showInBox) {
            if (!acc[item.user]) {
              acc[item.user] = {
                count: 0,
                action: item.action,
                timestamp: item.timestamp,
              };
            }
            acc[item.user].count += item.details
              ? item.details.split("\n").length
              : 1;
          }
          return acc;
        }, {} as Record<string, { count: number; action: string; timestamp: string }>);

        return (
          <div key={date} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-500 mb-4">{date}</h2>
            <ul className="space-y-4 relative">
              <div
                className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
              {dateItems.map((item, index) => {
                if (item.showInBox) {
                  const groupedAction = groupedActions[item.user];
                  if (
                    groupedAction &&
                    groupedAction.timestamp === item.timestamp
                  ) {
                    // Remove the grouped action so it's not rendered again
                    delete groupedActions[item.user];
                    return (
                      <li key={item.id} className="relative pl-10">
                        <div className="absolute left-0 top-0.5">
                          <TimelineIcon type={item.icon} />
                        </div>
                        {(index < dateItems.length - 1 ||
                          groupIndex <
                            Object.keys(groupedItems).length - 1) && (
                          <div
                            className="absolute left-4 top-9 h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">{item.user}</span>{" "}
                              oppdaterte {groupedAction.count} felt på{" "}
                              {item.action.split(" på ")[1]}
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
                    );
                  }
                  return null;
                }
                return (
                  <li key={item.id} className="relative pl-10">
                    <div className="absolute left-0 top-0.5">
                      <TimelineIcon type={item.icon} />
                    </div>
                    {(index < dateItems.length - 1 ||
                      groupIndex < Object.keys(groupedItems).length - 1) && (
                      <div
                        className="absolute left-4 top-9 h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {item.id === "creation" ? (
                            <>
                              {item.action} av{" "}
                              <span className="font-medium">{item.user}</span>
                            </>
                          ) : (
                            <>
                              <span className="font-medium">{item.user}</span>{" "}
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
                );
              })}
            </ul>
            {allDetailsForDay.length > 0 && (
              <div className="mt-4 p-2 bg-gray-50 rounded-md text-sm text-muted-foreground">
                {allDetailsForDay.map((detail, index) => {
                  const [key, value] = detail.split("→").map((s) => s.trim());
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
                      return null; // Don't render other fields in the box
                  }
                  return (
                    <div
                      key={index}
                      className="flex items-center mb-1 last:mb-0"
                    >
                      <Icon className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium mr-2">{key}</span>
                      <span className="text-gray-500">→</span>
                      <span className="ml-2 bg-white px-2 py-0.5 rounded">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
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
    </div>
  );
}
