// app/monastary/[id]/page.tsx
import { Suspense } from "react";
import { getgonpa } from "@/app/actions/getactions";
import MonasterySectClient from "./MonasterySectClient";
import { StatueSkeleton } from "../../Statue/_Components/StatuesSkeleton";

function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, index) => (
          <StatueSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function MonasterySectPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<Loading />}>
      <MonasterySectContent sect={params.id} />
    </Suspense>
  );
}

async function MonasterySectContent({ sect }: { sect: string }) {
  const gonpadata = await getgonpa();
  const filteredData = gonpadata.filter((m: any) =>
    sect.toUpperCase() === "OTHER"
      ? !m.sect || m.sect === "OTHER"
      : m.sect === sect.toUpperCase()
  );

  return <MonasterySectClient monasteriesData={filteredData} sect={sect} />;
}
