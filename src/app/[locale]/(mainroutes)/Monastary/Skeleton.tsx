import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4">
      <Skeleton className="w-full max-w-5xl h-[300px] rounded-lg mb-8" />

      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-5 gap-4">
        {["Sakya", "Nyingma", "Kargye", "Bon", "Other"].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-12 flex-1 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
