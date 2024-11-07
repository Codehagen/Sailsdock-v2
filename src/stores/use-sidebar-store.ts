import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSidebarViews } from "@/actions/sidebar/get-views";
import { SidebarViewData } from "@/lib/internal-api/types";

interface SidebarStore {
  sidebarData: { [key: string]: SidebarViewData[] } | null;
  isLoading: boolean;
  error: Error | null;
  fetchSidebarData: () => Promise<void>;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      sidebarData: null,
      isLoading: false,
      error: null,
      fetchSidebarData: async () => {
        try {
          set({ isLoading: true });
          const response = await getSidebarViews();

          if (response?.success && response?.data?.[0]) {
            // The response.data[0] contains the sections object
            set({
              sidebarData: response.data[0],
              isLoading: false,
            });
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error("Error fetching sidebar data:", error);
          set({
            error: error as Error,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({ sidebarData: state.sidebarData }),
    }
  )
);
