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
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";

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
              title: "All Personer",
              url: "/people",
              icon: UsersRound,
            },
            {
              title: "Add Person",
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
              title: "All Bedrifter",
              url: "/company",
              icon: Building2,
            },
            {
              title: "Add Bedrift",
              url: "/company/add",
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
        {
          title: "Kanban",
          url: "/kanban",
          icon: ArrowRight,
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

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center space-x-2">
                {/* <Icons.logo className="w-auto h-[40px]" /> */}
                <span className="font-bold text-xl">Sailsdock</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={updatedNavMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
