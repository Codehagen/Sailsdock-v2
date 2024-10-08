import Header from "@/components/sections/header";
import { Icons } from "@/components/shared/icons";
import { DashboardNav } from "@/components/shell/nav";
import { notFound } from "next/navigation";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: { id: string };
}

type NavItem = {
  href: string;
  title: string;
  disabled?: boolean;
  icon?: keyof typeof Icons;
  completed?: boolean;
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const sidebarNavItems = [
    {
      title: "Dashboard",
      href: `/dashboard`,
      icon: "layout",
    },
    {
      title: "Personer",
      href: `/people`,
      icon: "user",
    },
    {
      title: "Bedrifter",
      href: `/company`,
      icon: "building",
    },
    {
      title: "Opportunities",
      href: `/opportunities`,
      icon: "goal",
    },
    {
      title: "Tasks",
      href: `/tasks`,
      icon: "listTodo",
    },
    {
      title: "Notes",
      href: `/notes`,
      icon: "notebook",
    },
    {
      title: "Kanban",
      href: `/kanban`,
      icon: "arrowRight",
    },

    // {
    //   title: "Dokumenter",
    //   href: `/tenant/${params.id}/files`,
    //   icon: "file",
    // },
  ] satisfies NavItem[];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container pt-8">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {" "}
          {/* Increased nav width and reduced gap */}
          <aside className="hidden md:block">
            <DashboardNav items={sidebarNavItems} />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
