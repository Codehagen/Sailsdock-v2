import * as React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavSecondaryProps extends React.ComponentProps<typeof SidebarMenu> {
  items: Array<{
    title: string;
    url?: string;
    icon: React.ElementType;
    component?: React.ReactNode;
  }>;
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  return (
    <SidebarMenu {...props}>
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
          {item.component ? (
            item.component
          ) : (
            <SidebarMenuButton asChild>
              <Link href={item.url || "#"}>
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
