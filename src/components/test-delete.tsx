"use client";

import { createSidebarView } from "@/actions/sidebar/create-view";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function TestSidebarView() {
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const handleCreateView = async (
    parentElement: number,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    try {
      const testView = {
        name: `Test View ${parentElement} - ${new Date().toISOString()}`,
        description: `This is a test view in section ${parentElement}`,
        icon: "layout",
        url: "https://sailsdock.no/company/a16148be-d919-4a60-a736-e54ef368edff",
        sorting: 1,
        fields: { test: "data" },
        parent_element: parentElement,
      };

      const result = await createSidebarView(testView);
      console.log(`Created view in section ${parentElement}:`, result);
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
        {isLoading2 ? "Creating..." : "Create View in Section 2"}
      </Button>
    </div>
  );
}
