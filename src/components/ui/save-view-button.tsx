"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SaveIcon,
  Check,
  X,
  Building,
  Users,
  User,
  LayoutDashboard,
  ListTodo,
  Star,
  Table,
  List,
  Grid,
  Filter,
  Search,
} from "lucide-react";
import { createSidebarView } from "@/actions/sidebar/create-view";
import { toast } from "sonner";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { useSearchParams } from "next/navigation";

interface SaveViewButtonProps {
  parentElement: number; // 2 for Personer, 3 for Bedrifter
}

const viewIcons = [
  { icon: Building, name: "Building" },
  { icon: Users, name: "Users" },
  { icon: User, name: "User" },
  { icon: LayoutDashboard, name: "LayoutDashboard" },
  { icon: ListTodo, name: "ListTodo" },
  { icon: Star, name: "Star" },
  { icon: Table, name: "Table" },
  { icon: List, name: "List" },
  { icon: Grid, name: "Grid" },
  { icon: Filter, name: "Filter" },
  { icon: Search, name: "Search" },
];

export function SaveViewButton({ parentElement }: SaveViewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewName, setViewName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Building");
  const { fetchSidebarData } = useSidebarStore();
  const searchParams = useSearchParams();

  const handleSaveView = async () => {
    try {
      if (!viewName.trim()) {
        toast.error("Vennligst skriv inn et navn");
        return;
      }

      // Get the current pathname and search params
      const currentUrl = window.location.pathname;
      const queryString = searchParams.toString();
      
      // Construct the full URL with search params
      const fullUrl = `https://www.sailsdock.no${currentUrl}${
        queryString ? `?${queryString}` : ""
      }`;

      const viewData = {
        name: viewName,
        icon: selectedIcon,
        url: fullUrl,
        description: `Saved view for ${viewName}`,
        parent_element: parentElement,
        sorting: 1,
        fields: null,
      };

      const result = await createSidebarView(viewData);

      if (result) {
        toast.success("Visning lagret");
        await fetchSidebarData();
        setIsOpen(false);
        setViewName("");
      } else {
        throw new Error("Failed to save view");
      }
    } catch (error) {
      console.error("Error saving view:", error);
      toast.error("Kunne ikke lagre visning");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <SaveIcon className="mr-2 h-4 w-4" />
          Lagre visning
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Lagre visning</h4>
            <p className="text-sm text-muted-foreground">
              Gi visningen et navn og velg et ikon
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="name"
              placeholder="Navn på visning"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
            <Select value={selectedIcon} onValueChange={setSelectedIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Velg ikon" />
              </SelectTrigger>
              <SelectContent>
                {viewIcons.map(({ icon: IconComponent, name }) => (
                  <SelectItem key={name} value={name}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Avbryt
            </Button>
            <Button size="sm" onClick={handleSaveView}>
              <Check className="mr-2 h-4 w-4" />
              Lagre
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
