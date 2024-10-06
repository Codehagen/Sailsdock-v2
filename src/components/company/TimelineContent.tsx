"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Paperclip,
  Link,
  Users,
  Building2,
  Globe,
  CheckSquare,
  Rocket, // Add this import
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
      action: "Du oppdaterte en relatert oppgave Uten tittel",
      timestamp: "2024-10-06T10:00:00Z",
      icon: "task",
    },
    {
      id: "2",
      action: "Du oppdaterte ICP → ✗ Usann",
      timestamp: "2024-10-05T14:30:00Z",
      icon: "status",
    },
    {
      id: "3",
      action: "Du oppdaterte 2 felt på Vegard Enterprises",
      details: "Linkedin → sailsdock.no\nARR → $",
      timestamp: "2024-10-05T09:00:00Z",
      icon: "company",
    },
    // Add the Propdock creation item as the last (oldest) item
    {
      id: "creation",
      action: "Propdock ble laget av deg",
      timestamp: "2024-01-01T00:00:00Z", // Set this to the actual creation date
      icon: "creation",
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
      {Object.entries(groupedItems).map(([date, dateItems], groupIndex) => (
        <div key={date} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-500 mb-4">{date}</h2>
          <ul className="space-y-4 relative">
            <div
              className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
            {dateItems.map((item, index) => (
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
                      <span className="font-medium">{item.action}</span>
                    </p>
                    {item.details && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-muted-foreground">
                        {item.details}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground ml-4 whitespace-nowrap">
                    {item.id === "creation"
                      ? ""
                      : format(
                          parseISO(item.timestamp),
                          "'for' d 'dager siden'",
                          {
                            locale: nb,
                          }
                        )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
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
