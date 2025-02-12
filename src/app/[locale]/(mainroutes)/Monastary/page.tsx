import React, { Suspense } from "react";
import Link from "next/link";
import { getgonpa } from "@/app/actions/getactions";
import { Card } from "@/components/ui/card";
import LoadingSkeleton from "./Skeleton";

const bgimagelink = [
  {
    nyingma: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732078167GP205668.jpg",
    kagyu: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731493541GP205597.jpg",
    sakya: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732251070GP205684.jpg",
    gelug: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731488192GP205592.jpg",
    bhon: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731914731GP205645.jpg",
    remey:"https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732603840GP205717.jpg",
    jonang:"https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731559304GP205604.jpg",
    shalu:"https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732605178GP205720.jpg",
    bodong:"https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732602550GP205715.jpg",
    other: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732603251GP205716.jpg",
  }
];

export default function MonasteryDashboardPage({ params }: any) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MonasteryDashboardContent locales={params.locale} />
    </Suspense>
  );
}

async function MonasteryDashboardContent(locales: any) {
  const gonpadata = await getgonpa();
  const groupedMonasteries = {
    NYINGMA: gonpadata.filter((m: any) => m.sect === "NYINGMA"),
    KAGYU: gonpadata.filter((m: any) => m.sect === "KAGYU"),
    SAKYA: gonpadata.filter((m: any) => m.sect === "SAKYA"),
    GELUG: gonpadata.filter((m: any) => m.sect === "GELUG"),
    BHON: gonpadata.filter((m: any) => m.sect === "BHON"),
    REMEY: gonpadata.filter((m:any)=>m.sect==="REMEY"),
    JONANG: gonpadata.filter((m:any)=>m.sect==="JONANG"),
    SHALU: gonpadata.filter((m:any)=>m.sect==="SHALU"),
    BODONG: gonpadata.filter((m:any)=>m.sect==="BODONG"),
    other: gonpadata.filter((m: any) => !m.sect || m.sect === "OTHER"),
  };

  const getBackgroundImage = (sect: string) => {
    const lowerSect = sect.toLowerCase();
    return bgimagelink[0][lowerSect as keyof typeof bgimagelink[0]];
  };

  return (
    <div className="container mx-auto pt-8 px-4">
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedMonasteries).map(([sect, monasteries]) => (
          <Link
            href={`/Monastary/${sect}`}
            key={sect}
            className="group block overflow-hidden"
          >
            <Card className="relative aspect-[4/5] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${getBackgroundImage(sect)})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white capitalize">
                    {sect.toLowerCase()}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {monasteries.length} Monasteries
                  </p>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm text-white backdrop-blur-sm">
                    View Monastery
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}