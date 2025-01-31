import React, { Suspense } from "react";
import Link from "next/link";
import { StatueSkeleton } from "../Statue/_Components/StatuesSkeleton";
import { getgonpa } from "@/app/actions/getactions";
import { Badge } from "@/components/ui/badge";

function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <StatueSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MonasteryDashboardPage({ params }: any) {
  const { locale } = params;
  return (
    <Suspense fallback={<Loading />}>
      <MonasteryDashboardContent locales={locale} />
    </Suspense>
  );
}

async function MonasteryDashboardContent(locales: any) {
  const gonpadata = await getgonpa();

  const groupedMonasteries = {
    sakya: gonpadata.filter((m: any) => m.sect === "SAKYA"),
    nyingma: gonpadata.filter((m: any) => m.sect === "NYINGMA"),
    kargye: gonpadata.filter((m: any) => m.sect === "KAGYU"),
    bon: gonpadata.filter((m: any) => m.sect === "BON"),
    other: gonpadata.filter((m: any) => !m.sect || m.sect === "OTHER"),
  };
  console.log(locales);

  return (
    <div className="container mx-auto pt-8 px-4">
      <div className="relative h-[20rem] w-full rounded-xl bg-fixed bg-cover bg-center bg-[url('../../public/mons.jpg')]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/0 rounded-xl" />
        <div className="relative z-10 p-6">
          <p className={`text-white text-3xl font-bold font-monlamuchen`}>
            དགོན་པའི་ཐོ་གཞུང་
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(groupedMonasteries).map(([sect, monasteries]) => (
          <Link
            href={`/Monastary/${sect.toLowerCase()}`}
            key={sect}
            className="block"
          >
            <div className="group p-4 border rounded-lg  transition-all hover:shadow-md bg-white">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium capitalize">
                  {sect}
                </span>
                <Badge variant="secondary" className="ml-2">
                  {monasteries.length}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
