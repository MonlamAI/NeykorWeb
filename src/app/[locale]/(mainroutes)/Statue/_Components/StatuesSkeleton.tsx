// components/StatueSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function StatueSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden ">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
