"use server";

import { SidebarViewData } from "@/lib/internal-api/types";

export async function getSidebarData(): Promise<{
  [key: string]: SidebarViewData[];
} | null> {
  // Mock data
  const mockData: { [key: string]: SidebarViewData[] } = {
    "1": [
      {
        uuid: "593e042b-2fc5-4eb3-aead-9ce031808e77",
        name: "Dashboard",
        description: "Overview of your workspace",
        icon: "LayoutDashboard",
        url: "/dashboard",
        sorting: 1,
        fields: null,
      },
      {
        uuid: "7a1b03e9-5c2d-4f8a-b4e6-3d8f9c10a2b5",
        name: "Projects",
        description: "Manage your projects",
        icon: "Briefcase",
        url: "/projects",
        sorting: 2,
        fields: null,
      },
    ],
    "2": [
      {
        uuid: "2c4e6f8a-1d3b-5e7c-9g8h-4i5j6k7l8m9n",
        name: "Tasks",
        description: "View and manage tasks",
        icon: "CheckSquare",
        url: "/tasks",
        sorting: 1,
        fields: null,
      },
      {
        uuid: "3d5f7g9h-2e4c-6i8k-1m3n-5o7p9q1r3s5t",
        name: "Calendar",
        description: "Schedule and events",
        icon: "Calendar",
        url: "/calendar",
        sorting: 2,
        fields: null,
      },
    ],
    "3": [
      {
        uuid: "4e6f8g9h-1i2j-3k4l-5m6n-7o8p9q0r1s2t",
        name: "John Doe",
        description: "Contact details for John Doe",
        icon: "User",
        url: "/people/john-doe",
        sorting: 1,
        fields: null,
      },
      {
        uuid: "5f7g8h9i-2j3k-4l5m-6n7o-8p9q0r1s2t3u",
        name: "Jane Smith",
        description: "Contact details for Jane Smith",
        icon: "User",
        url: "/people/jane-smith",
        sorting: 2,
        fields: null,
      },
    ],
    "4": [
      {
        uuid: "6g8h9i0j-3k4l-5m6n-7o8p-9q0r1s2t3u4v",
        name: "Acme Corp",
        description: "Details for Acme Corporation",
        icon: "Building",
        url: "/company/acme-corp",
        sorting: 1,
        fields: null,
      },
      {
        uuid: "7h9i0j1k-4l5m-6n7o-8p9q-0r1s2t3u4v5w",
        name: "TechStart Inc",
        description: "Details for TechStart Inc",
        icon: "Building",
        url: "/company/techstart-inc",
        sorting: 2,
        fields: null,
      },
    ],
  };

  // Simulate an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  return mockData;
}
