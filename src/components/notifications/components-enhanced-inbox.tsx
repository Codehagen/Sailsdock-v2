"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Inbox } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  avatar: string;
  name: string;
  action: string;
  project: string;
  description: string;
  time: string;
  date: Date;
  read: boolean;
}

// Sample data
const allNotifications: Notification[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  avatar: `/avatars/${(i % 3) + 1}.png`,
  name: ["John", "Christer", "Emma"][i % 3],
  action: ["commented in", "sendte deg en oppgave", "mentioned you in"][i % 3],
  project: `Project ${i + 1}`,
  description: `This is notification ${
    i + 1
  }. It contains important information about the project.`,
  time: `${i + 1} hours ago`,
  date: new Date(Date.now() - i * 3600000),
  read: i % 2 === 0,
}));

export function EnhancedInbox() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Inbox" className="relative w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Inbox className="mr-2 h-4 w-4" />
                <span>Inbox</span>
              </div>
              {isTestMode && unreadCount > 0 && (
                <Badge className="ml-auto h-5 min-w-[20px] px-1 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[90vw] max-w-[600px] sm:w-[600px]"
      >
        <EnhancedInboxContent setUnreadCount={setUnreadCount} isTestMode={isTestMode} setIsTestMode={setIsTestMode} />
      </SheetContent>
    </Sheet>
  );
}

function EnhancedInboxContent({
  setUnreadCount,
  isTestMode,
  setIsTestMode,
}: {
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  isTestMode: boolean;
  setIsTestMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNotificationElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const currentLength = notifications.length;
          const newNotifications = allNotifications
            .slice(currentLength, currentLength + 10);
          setNotifications((prev) => [...prev, ...newNotifications]);
          setHasMore(currentLength + newNotifications.length < allNotifications.length);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, notifications.length]
  );

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.date.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const markAllAsRead = () => {
    setNotifications([]);
    setHasMore(false);
    setUnreadCount(0);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTestNotifications = () => {
    setIsTestMode(true);
    setNotifications(allNotifications.slice(0, 10));
    setHasMore(allNotifications.length > 10);
    setUnreadCount(allNotifications.length);
  };

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications, setUnreadCount]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Inbox</h2>
        {isTestMode ? (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={handleTestNotifications}>
            Test Varsler
          </Button>
        )}
      </div>
      <ScrollArea className="flex-grow">
        {isTestMode ? (
          Object.entries(groupedNotifications).map(
            ([date, groupNotifications], groupIndex) => (
              <div key={date}>
                <div className="sticky top-0 bg-background z-10 px-4 py-2 font-semibold text-sm text-muted-foreground">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                {groupNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    ref={
                      groupIndex ===
                        Object.keys(groupedNotifications).length - 1 &&
                      index === groupNotifications.length - 1
                        ? lastNotificationElementRef
                        : null
                    }
                    className="p-4 border-b hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={notification.avatar}
                          alt={notification.name}
                        />
                        <AvatarFallback>{notification.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {notification.name} {notification.action}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm font-medium text-muted-foreground">
                          <FileText className="mr-2 h-4 w-4" />
                          {notification.project}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          <Button variant="secondary" size="sm">
                            Reply
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRead(notification.id)}
                          >
                            {notification.read
                              ? "Mark as unread"
                              : "Mark as read"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Press "Test Varsler" to populate the inbox with test notifications.
          </div>
        )}
        {hasMore && <div className="p-4 text-center">Loading more...</div>}
      </ScrollArea>
    </div>
  );
}
