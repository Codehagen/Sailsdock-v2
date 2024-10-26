import { useQuery } from "@tanstack/react-query";
import { getSidebarData } from "@/actions/sidebar/get-sidebar-data";

const SIDEBAR_DATA_KEY = "sidebarData";
const SIDEBAR_DIGEST_KEY = "sidebarDigest";

export function useSidebarData() {
  return useQuery({
    queryKey: ["sidebarData"],
    queryFn: async () => {
      const storedDigest = localStorage.getItem(SIDEBAR_DIGEST_KEY);
      const response = await getSidebarData();
      
      if (response.digest !== storedDigest) {
        // Update local storage if the digest has changed
        localStorage.setItem(SIDEBAR_DATA_KEY, JSON.stringify(response.data));
        localStorage.setItem(SIDEBAR_DIGEST_KEY, response.digest);
        return response.data;
      }
      
      // If digest hasn't changed, use data from local storage
      const storedData = localStorage.getItem(SIDEBAR_DATA_KEY);
      return storedData ? JSON.parse(storedData) : response.data;
    },
    staleTime: Infinity, // Data is never considered stale
    gcTime: Infinity, // Keep the data in cache indefinitely
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Only refetch periodically to check for updates
    refetchInterval: 1000 * 60 * 60, // Check for updates every hour
    initialData: () => {
      const storedData = localStorage.getItem(SIDEBAR_DATA_KEY);
      return storedData ? JSON.parse(storedData) : undefined;
    },
  });
}
