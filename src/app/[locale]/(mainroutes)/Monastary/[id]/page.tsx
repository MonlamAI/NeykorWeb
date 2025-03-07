import { Suspense } from "react";
import { getGonpa } from "@/app/actions/getactions";
import MonasterySectClient from "./MonasterySectClient";
import { StatueSkeleton } from "../../Statue/_Components/StatuesSkeleton";
import { OTHER_SECTS } from "@/lib/utils";

function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-6">
      {[...Array(9)].map((_, index) => (
        <StatueSkeleton key={index} />
      ))}
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
  const gonpadata: any[] = await getGonpa() as any[];
  const filteredData = gonpadata.filter((m: any) =>
    sect.toUpperCase() === "OTHER"
      ? !m.sect || OTHER_SECTS.includes(m.sect)
      : m.sect === sect.toUpperCase()
  );
  
  return <MonasterySectClient monasteriesData={filteredData} sect={sect} />;
}
