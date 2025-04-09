import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
export default function LoadingSkeleton() {
  return (
    <div className=" w-screen h-full mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Skeleton */}
        <Card className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
        </Card>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
