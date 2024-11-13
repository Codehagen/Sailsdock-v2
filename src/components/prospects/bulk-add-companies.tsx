"use client";

import { Button } from "@/components/ui/button";
import { createCompany } from "@/actions/company/create-companies";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table } from "@tanstack/react-table";

interface BulkAddCompaniesProps<TData> {
  table: Table<TData>;
}

export function BulkAddCompanies<TData>({
  table,
}: BulkAddCompaniesProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  if (!selectedCount) return null;

  const handleBulkAdd = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const results = await Promise.all(
        selectedRows.map(async (row) => {
          const data = {
            name: row.original.name || "",
            orgnr: row.original.orgnr || "",
            address_street: row.original.geo_street || "",
            address_city: row.original.geo_city || "",
            address_zip: row.original.geo_zip || "",
          };

          return await createCompany(data);
        })
      );

      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(`Bedrifter lagt til`, {
          description: `${successCount} bedrifter ble lagt til`,
        });

        // Clear selection after successful addition
        table.toggleAllRowsSelected(false);
      }
    } catch (error) {
      console.error("Error creating companies:", error);
      toast.error("En feil oppstod", {
        description: "Kunne ikke legge til alle bedrifter",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBulkAdd}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>Legg til {selectedCount} bedrifter</>
      )}
    </Button>
  );
}
