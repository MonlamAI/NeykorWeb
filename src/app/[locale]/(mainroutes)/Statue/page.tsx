import { Suspense } from "react";
import { getStatues } from "@/app/actions/getactions";
import StatuesClient from "./StatuesClient";
import { StatueSkeleton } from "./_Components/StatuesSkeleton";

function LoadingStatues() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-screen p-6">
      {[...Array(9)].map((_, index) => (
        <StatueSkeleton key={index} />
      ))}
    </div>
  );
}

export default function StatuesPage() {
  return (
    <Suspense fallback={<LoadingStatues />}>
      <StatuesContent />
    </Suspense>
  );
}

async function StatuesContent() {
  const statuesData = await getStatues();
  return <StatuesClient statuesData={statuesData} />;
}
