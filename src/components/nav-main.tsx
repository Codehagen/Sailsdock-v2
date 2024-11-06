"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Star, type LucideIcon } from "lucide-react";
import { EnhancedInbox } from "@/components/notifications/components-enhanced-inbox";
import { getSidebarData } from "@/actions/sidebar/get-sidebar-data";
import { SidebarViewData } from "@/lib/internal-api/types";
import * as LucideIcons from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebarStore } from "@/stores/use-sidebar-store";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface NavMainProps {
  groups: NavGroup[];
}

export function NavMain({ groups }: NavMainProps) {
  const { sidebarData, isLoading, fetchSidebarData } = useSidebarStore();

  useEffect(() => {
    if (!sidebarData) {
      fetchSidebarData();
    }
  }, [sidebarData, fetchSidebarData]);

  const getLucideIcon = (iconName: string): LucideIcon => {
    // Remove the file extension if present
    const cleanIconName = iconName.replace(/\.[^/.]+$/, "");
    return (
      (LucideIcons[cleanIconName as keyof typeof LucideIcons] as LucideIcon) ||
      LucideIcons.HelpCircle
    );
  };

  const renderSidebarGroup = (
    groupKey: string,
    groupLabel: string,
    isStarred: boolean = false
  ) => {
    if (isLoading) {
      return (
        <SidebarGroup key={groupKey}>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {/* Add skeleton loading state here */}
            {Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className="flex h-9 items-center px-4 animate-pulse">
                  <div className="h-4 w-4 rounded bg-muted mr-2" />
                  <div className="h-4 w-24 rounded bg-muted" />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      );
    }

    if (
      !sidebarData ||
      !sidebarData[groupKey] ||
      sidebarData[groupKey].length === 0
    ) {
      return null;
    }

    return (
      <SidebarGroup key={groupKey}>
        <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
        <SidebarMenu>
          {sidebarData[groupKey].map((view) => {
            const IconComponent = isStarred ? Star : getLucideIcon(view.icon);
            return (
              <SidebarMenuItem key={view.uuid}>
                <SidebarMenuButton asChild tooltip={view.name}>
                  <Link href={view.url}>
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span>{view.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    );
  };

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <EnhancedInbox />
        </SidebarMenu>
      </SidebarGroup>

      {renderSidebarGroup("1", "Favorites", true)}
      {renderSidebarGroup("2", "Views")}

      {/* Platform and other groups */}
      {groups.map((group) => (
        <SidebarGroup key={group.group}>
          <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={item.isActive}
                  >
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                              >
                                <Link href={subItem.url}>
                                  <subItem.icon className="mr-2 h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
