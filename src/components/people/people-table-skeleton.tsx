import { Skeleton } from "@/components/ui/skeleton";

export function PeopleTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[120px]" />
      </div>
      <div className="border rounded-md">
        <div className="h-12 px-4 border-b flex items-center">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-[100px] mr-4" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 px-4 flex items-center">
            {[...Array(6)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-[100px] mr-4" />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[120px]" />
      </div>
    </div>
  );
}
