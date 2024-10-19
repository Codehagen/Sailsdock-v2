import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: { id: string };
}

export default function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
          </header>
          <main className="flex-1 p-4 pt-0 overflow-hidden">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
