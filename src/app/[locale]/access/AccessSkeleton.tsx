export function AccessSkeleton() {
    return (
      <div className="rounded-md border animate-pulse">
        <div className="p-4">
          <div className="h-10 w-40 bg-gray-200 dark:bg-neutral-900  rounded mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-neutral-900  rounded" />
            {[...Array(5)].map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4">
                <div className="h-8 bg-gray-200 dark:bg-neutral-900 rounded" />
                <div className="h-8 bg-gray-200 dark:bg-neutral-900 rounded" />
                <div className="h-8 bg-gray-200 dark:bg-neutral-900 rounded" />
                <div className="h-8 w-8 bg-gray-200 dark:bg-neutral-900  rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }