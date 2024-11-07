import { getCurrentUser } from "@/actions/user/get-user-data";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSidebarViews } from "@/actions/sidebar/get-views";
import { TestSidebarView } from "@/components/test-delete";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  console.log("User:", user);
  const sidebarViews = await getSidebarViews();
  console.log("Sidebar views:", sidebarViews);

  if (!user) {
    console.error("No user data found");
    return null;
  }

  return (
    <div className="space-y-4">
      <TestSidebarView />

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Hei {user.first_name}, Velkommen tilbake 👋
        </h2>
        <div className="hidden items-center space-x-2 md:flex">
          <CalendarDateRangePicker />
          <Button>Last Ned</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="market">Markedet</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="layout" />
            <EmptyPlaceholder.Title>
              Dashboard under utvikling
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Her vil det komme et dashboard, men vi jobber fortsatt med
              utviklingen. Kom tilbake snart for å se fremgangen!
            </EmptyPlaceholder.Description>
            <Button className="mt-4">Få varsel når det er klart</Button>
          </EmptyPlaceholder>
        </TabsContent>
        <TabsContent value="market" className="space-y-4">
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="search" />
            <EmptyPlaceholder.Title>
              Ingen markedsdata tilgjengelig
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Det er ingen markedsdata tilgjengelig for øyeblikket. Kom tilbake
              senere for oppdateringer.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        </TabsContent>
      </Tabs>
    </div>
  );
}
