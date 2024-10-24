"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building,
  Target,
  ListTodo,
  BookOpen,
  ArrowRight,
  Settings2,
  LifeBuoy,
  Send,
  UserPlus,
  UsersRound,
  Building2,
  Star,
  Command,
  Settings,
  Bot,
  Frame,
  PieChart,
  Map,
  MoreHorizontal,
  Folder,
  Share,
  Trash2,
  MessageSquare,
  Sparkles,
  Brain,
  Zap,
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
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { FeedbackDialog } from "@/components/feedback-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const data = {
  user: {
    name: "Christer Hagen",
    email: "christer@sailsdock.no",
    avatar: "/avatars/john-doe.jpg",
  },
  navMain: [
    {
      group: "Favorites",
      items: [
        {
          title: "Bedrift 1",
          url: "/quick-dashboard",
          icon: Star,
        },
        {
          title: "Bedrift 2",
          url: "/recent-contacts",
          icon: Star,
        },
      ],
    },
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
          items: [
            {
              title: "Test Person",
              url: "/people/82be121f-b56c-46db-abb3-bccc5c7c0267",
              icon: UsersRound,
            },
            {
              title: "Placeholder",
              url: "/people/add",
              icon: UserPlus,
            },
          ],
        },
        {
          title: "Bedrifter",
          url: "/company",
          icon: Building,
          items: [
            {
              title: "Min View",
              url: "/company?ppl=christer+hagen&aa=10%2C20&sk=last-3-months",
              icon: Building2,
            },
            {
              title: "Placeholder",
              url: "/company?ppl=mathias+moen&aa=0%2C20",
              icon: Building2,
            },
          ],
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
    // {
    //   name: "AI Models",
    //   url: "/ai/models",
    //   icon: Brain,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  // Function to check if a nav item is active
  const isActiveNavItem = (item: any): boolean => {
    if (item.url === pathname) return true;
    if (item.items) {
      return item.items.some((subItem: any) => subItem.url === pathname);
    }
    return false;
  };

  // Update navMain items with isActive property
  const updatedNavMain = data.navMain.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: isActiveNavItem(item),
      items: item.items
        ? item.items.map((subItem) => ({
            ...subItem,
            isActive: subItem.url === pathname,
          }))
        : undefined,
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

        {/* Update the AI Projects section */}
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
