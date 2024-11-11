"use client";

import { createSidebarView } from "@/actions/sidebar/create-view";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function TestSidebarView() {
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const handleCreateView = async (
    parentElement: number,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    try {
      const getIcon = (section: number) => {
        switch (section) {
          case 2:
            return "Users";
          case 3:
            return "Building";
          default:
            return "layout";
        }
      };

      const getUrl = (section: number) => {
        switch (section) {
          case 2:
            return "/people/f5f3c97a-93ec-41a1-a509-94e238570a69";
          case 3:
            return "/company/ae8fe6f1-e5b8-465b-b67a-138791a41401";
          default:
            return "/dashboard";
        }
      };

      const testView = {
        name: `Test View ${parentElement} - ${new Date().toISOString()}`,
        description: `This is a test view in section ${parentElement}`,
        icon: getIcon(parentElement),
        url: getUrl(parentElement),
        sorting: 1,
        fields: { test: "data" },
        parent_element: parentElement,
      };

      const result = await createSidebarView(testView);
      // console.log(`Created view in section ${parentElement}:`, result);
    } catch (error) {
      console.error(`Error creating view in section ${parentElement}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-x-4">
      <Button
        onClick={() => handleCreateView(1, setIsLoading1)}
        disabled={isLoading1}
        variant="outline"
      >
        {isLoading1 ? "Creating..." : "Create View in Section 1"}
      </Button>

      <Button
        onClick={() => handleCreateView(2, setIsLoading2)}
        disabled={isLoading2}
        variant="outline"
      >
        {isLoading2 ? "Creating..." : "Create Person View"}
      </Button>

      <Button
        onClick={() => handleCreateView(3, setIsLoading3)}
        disabled={isLoading3}
        variant="outline"
      >
        {isLoading3 ? "Creating..." : "Create Company View"}
      </Button>
    </div>
  );
}
