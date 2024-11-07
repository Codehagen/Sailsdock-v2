"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Building,
  Target,
  ListTodo,
  BookOpen,
  Settings,
  LifeBuoy,
  Send,
  LucideIcon,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { useSidebarStore } from "@/stores/use-sidebar-store";

const data = {
  user: {
    name: "Christer Hagen",
    email: "christer@sailsdock.no",
    avatar: "/avatars/john-doe.jpg",
  },
  navMain: [
    {
      group: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Personer",
          url: "/people",
          icon: Users,
        },
        {
          title: "Bedrifter",
          url: "/company",
          icon: Building,
        },
        {
          title: "Opportunities",
          url: "/opportunities",
          icon: Target,
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: ListTodo,
        },
        {
          title: "Notes",
          url: "/notes",
          icon: BookOpen,
        },
      ],
    },
  ],
  aiProjects: [
    {
      name: "AI Assistants",
      url: "/generator",
      icon: Sparkles,
    },
    {
      name: "Chat",
      url: "/ai/chat",
      icon: MessageSquare,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/help",
      icon: LifeBuoy,
    },
    {
      title: "Tilbakemelding",
      url: "/help",
      icon: Send,
    },
    {
      title: "Innstillinger",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { sidebarData, fetchSidebarData } = useSidebarStore();

  React.useEffect(() => {
    if (!sidebarData) {
      fetchSidebarData();
    }
  }, [sidebarData, fetchSidebarData]);

  // Function to check if a nav item is active
  const isActiveNavItem = (item: any): boolean => {
    if (item.url === pathname) return true;
    if (item.items) {
      return item.items.some((subItem: any) => subItem.url === pathname);
    }
    return false;
  };

  // Update navMain items with isActive property and dynamic subsections
  const updatedNavMain = data.navMain.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: isActiveNavItem(item),
    })),
  }));

  // Update the navSecondary items to include the FeedbackDialog
  const navSecondaryWithFeedback = data.navSecondary.map((item) => {
    if (item.title === "Tilbakemelding") {
      return {
        ...item,
        component: (
          <FeedbackDialog>
            <SidebarMenuButton>
              <Send className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </FeedbackDialog>
        ),
      };
    }
    return item;
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Icons.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Sailsdock</span>
                  <span className="truncate text-xs">Kjeldsberg</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={updatedNavMain} />

        {/* AI Projects Section */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>AI Projects</SidebarGroupLabel>
          <SidebarMenu>
            {data.aiProjects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <NavSecondary items={navSecondaryWithFeedback} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
