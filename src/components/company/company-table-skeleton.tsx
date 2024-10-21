import { Skeleton } from "@/components/ui/skeleton";

export function CompanyTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <div className="h-16 border-b px-4 py-3">
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[120px]" />
      </div>
    </div>
  );
}
