"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  type LucideIcon,
  MoreHorizontal,
  Star,
  Trash2,
  Pencil,
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
import { updateSidebarView } from "@/actions/sidebar/update-view";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  const [editingViewId, setEditingViewId] = useState<string | null>(null);

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

  const handleRenameView = async (viewId: string, newName: string) => {
    try {
      const success = await updateSidebarView(viewId, { name: newName });
      if (success) {
        await fetchSidebarData();
        toast.success("Navn oppdatert");
        setIsRenaming(false);
        setNewName("");
        setSelectedViewId(null);
      } else {
        toast.error("Kunne ikke oppdatere navn");
      }
    } catch (error) {
      console.error("Error renaming view:", error);
      toast.error("Kunne ikke oppdatere navn");
    }
  };

  const handleStartEditing = (viewId: string, currentName: string) => {
    setEditingViewId(viewId);
    setNewName(currentName);
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent,
    viewId: string,
    originalName: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newName.trim() && newName !== originalName) {
        await handleRenameView(viewId, newName);
      }
      setEditingViewId(null);
    } else if (e.key === "Escape") {
      setEditingViewId(null);
      setNewName(originalName);
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
                          {editingViewId === view.uuid ? (
                            <Input
                              className="h-6 w-[120px]"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, view.uuid, view.name)
                              }
                              onBlur={() => {
                                setEditingViewId(null);
                                setNewName(view.name);
                              }}
                              autoFocus
                              onClick={(e) => e.preventDefault()}
                            />
                          ) : (
                            <span>{view.name}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-[160px]">
                    <ContextMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        handleStartEditing(view.uuid, view.name);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Bytt navn
                    </ContextMenuItem>
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
                                          {editingViewId === view.uuid ? (
                                            <Input
                                              className="h-6 w-[120px]"
                                              value={newName}
                                              onChange={(e) =>
                                                setNewName(e.target.value)
                                              }
                                              onKeyDown={(e) =>
                                                handleKeyDown(
                                                  e,
                                                  view.uuid,
                                                  view.name
                                                )
                                              }
                                              onBlur={() => {
                                                setEditingViewId(null);
                                                setNewName(view.name);
                                              }}
                                              autoFocus
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
                                            />
                                          ) : (
                                            <span>{view.name}</span>
                                          )}
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent className="w-[160px]">
                                    <ContextMenuItem
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleStartEditing(
                                          view.uuid,
                                          view.name
                                        );
                                      }}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Bytt navn
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                      onClick={() =>
                                        handleRemoveView(view.uuid, view.name)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Fjern
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
                                          {editingViewId === view.uuid ? (
                                            <Input
                                              className="h-6 w-[120px]"
                                              value={newName}
                                              onChange={(e) =>
                                                setNewName(e.target.value)
                                              }
                                              onKeyDown={(e) =>
                                                handleKeyDown(
                                                  e,
                                                  view.uuid,
                                                  view.name
                                                )
                                              }
                                              onBlur={() => {
                                                setEditingViewId(null);
                                                setNewName(view.name);
                                              }}
                                              autoFocus
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
                                            />
                                          ) : (
                                            <span>{view.name}</span>
                                          )}
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent className="w-[160px]">
                                    <ContextMenuItem
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleStartEditing(
                                          view.uuid,
                                          view.name
                                        );
                                      }}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Bytt navn
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                      onClick={() =>
                                        handleRemoveView(view.uuid, view.name)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Fjern
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
