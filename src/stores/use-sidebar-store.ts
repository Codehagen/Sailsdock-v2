import { create } from "zustand";
import { getSidebarData } from "@/actions/sidebar/get-sidebar-data";
import { SidebarViewData } from "@/lib/internal-api/types";

interface SidebarStore {
  sidebarData: { [key: string]: SidebarViewData[] } | null;
  isLoading: boolean;
  error: Error | null;
  fetchSidebarData: () => Promise<void>;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarData: null,
  isLoading: false,
  error: null,
  fetchSidebarData: async () => {
    try {
      set({ isLoading: true });
      const data = await getSidebarData();
      set({ sidebarData: data, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
}));
