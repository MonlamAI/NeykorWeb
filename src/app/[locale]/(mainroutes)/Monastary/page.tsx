import React, { Suspense } from "react";
import Link from "next/link";
import { getgonpa } from "@/app/actions/getactions";
import { Badge } from "@/components/ui/badge";
import LoadingSkeleton from "./Skeleton";

export default function MonasteryDashboardPage({ params }: any) {
  const { locale } = params;
  return (
    <Suspense fallback={<LoadingSkeleton />}>
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
        <div className="relative flex flex-col items-center justify-center  w-full h-full z-10 p-6">
          <p className={`text-white text-3xl font-bold font-monlamuchen`}>
            དགོན་པའི་ཐོ་གཞུང་
          </p>
          <p className={`text-white text-center  font-monlamuchen`}>
            ༄༅། །གནས་མཆོག་དམ་པར་བགྲོད་པའི་ལམ་ཡངས་པོར། །
            བདེ་དགའི་འོད་སྣང་འཕྲོ་བའི་སྐྱེད་ཚལ་དུ། །
            དད་གུས་སེམས་ཀྱིས་གོམ་པ་མདུན་བསྐྱོད་ནས། །
            ཕྱོགས་བཞིའི་གནས་ཆེན་རྣམས་ལ་མཇལ་བར་ཤོག །
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
            <div className="group p-4 border rounded-lg  transition-all hover:shadow-md dark:bg-neutral-900 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-200 font-medium capitalize">
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
