"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  type LucideIcon,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import { EnhancedInbox } from "@/components/notifications/components-enhanced-inbox";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { removeSidebarView } from "@/actions/sidebar/remove-view";
import { toast } from "sonner";

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
    const cleanIconName = iconName.replace(/\.[^/.]+$/, "");
    return (
      (LucideIcons[cleanIconName as keyof typeof LucideIcons] as LucideIcon) ||
      LucideIcons.HelpCircle
    );
  };

  const handleRemoveView = async (viewId: string, viewName: string) => {
    try {
      const success = await removeSidebarView(viewId);
      if (success) {
        await fetchSidebarData();
        toast.success(`Visning "${viewName}" er fjernet`);
      } else {
        toast.error("Kunne ikke fjerne visning");
      }
    } catch (error) {
      console.error("Error removing view:", error);
      toast.error("Kunne ikke fjerne visning");
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <EnhancedInbox />
        </SidebarMenu>
      </SidebarGroup>

      {/* Favorites Section */}
      {sidebarData?.["1"] && (
        <SidebarGroup>
          <SidebarGroupLabel>Favoritter</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarData["1"].map((view) => {
              const Icon = getLucideIcon(view.icon);
              return (
                <ContextMenu key={view.uuid}>
                  <ContextMenuTrigger>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={view.name}>
                        <Link href={view.url}>
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{view.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-[160px]">
                    <ContextMenuItem
                      onClick={() => handleRemoveView(view.uuid, view.name)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Fjern
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {/* Platform Groups */}
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
                  {(item.items?.length ||
                    (item.title === "Personer" && sidebarData?.["2"]) ||
                    (item.title === "Bedrifter" && sidebarData?.["3"])) && (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* Default items */}
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

                          {/* Dynamic Person Views */}
                          {item.title === "Personer" &&
                            sidebarData?.["2"]?.map((view) => {
                              const Icon = getLucideIcon(view.icon);
                              return (
                                <ContextMenu key={view.uuid}>
                                  <ContextMenuTrigger>
                                    <SidebarMenuSubItem>
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                          href={view.url}
                                          className="flex-1"
                                        >
                                          <Icon className="mr-2 h-4 w-4" />
                                          <span>{view.name}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent className="w-[160px]">
                                    <ContextMenuItem
                                      onClick={() =>
                                        handleRemoveView(view.uuid, view.name)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Fjern visning
                                    </ContextMenuItem>
                                  </ContextMenuContent>
                                </ContextMenu>
                              );
                            })}

                          {/* Dynamic Company Views */}
                          {item.title === "Bedrifter" &&
                            sidebarData?.["3"]?.map((view) => {
                              const Icon = getLucideIcon(view.icon);
                              return (
                                <ContextMenu key={view.uuid}>
                                  <ContextMenuTrigger>
                                    <SidebarMenuSubItem>
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                          href={view.url}
                                          className="flex-1"
                                        >
                                          <Icon className="mr-2 h-4 w-4" />
                                          <span>{view.name}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent className="w-[160px]">
                                    <ContextMenuItem
                                      onClick={() =>
                                        handleRemoveView(view.uuid, view.name)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Fjern visning
                                    </ContextMenuItem>
                                  </ContextMenuContent>
                                </ContextMenu>
                              );
                            })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
