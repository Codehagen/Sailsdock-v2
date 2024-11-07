"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSidebarView } from "@/actions/sidebar/create-view";
import { removeSidebarView } from "@/actions/sidebar/remove-view";
import { toast } from "sonner";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { usePathname } from "next/navigation";

interface FavoriteButtonProps {
  name: string;
  url?: string;
  icon: string;
  description?: string;
  initialIsFavorite?: boolean;
  favoriteId?: string;
  className?: string;
}

export function FavoriteButton({
  name,
  url,
  icon,
  description = "",
  initialIsFavorite = false,
  favoriteId,
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchSidebarData } = useSidebarStore();
  const pathname = usePathname();

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    try {
      const fullUrl = `https://www.sailsdock.no${url || pathname}`;

      if (isFavorite && favoriteId) {
        // Remove from favorites
        const success = await removeSidebarView(favoriteId);
        if (success) {
          setIsFavorite(false);
          toast.success("Fjernet fra favoritter");
        } else {
          throw new Error("Failed to remove favorite");
        }
      } else {
        // Add to favorites
        const viewData = {
          name,
          url: fullUrl,
          icon,
          description,
          parent_element: 1, // 1 is for favorites
          sorting: 1,
          fields: null,
        };

        const result = await createSidebarView(viewData);

        // Check if the result has an id or uuid, indicating success
        if (result && (result.id || result.uuid)) {
          setIsFavorite(true);
          toast.success("Lagt til i favoritter");
        } else {
          throw new Error("Failed to add favorite");
        }
      }
      // Refresh sidebar data
      await fetchSidebarData();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Kunne ikke oppdatere favoritter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Star
        className={`h-4 w-4 ${
          isFavorite
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
      <span className="sr-only">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
