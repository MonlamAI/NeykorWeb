import React, { Suspense ,cache} from "react";
import Link from "next/link";
import Image from "next/image";
import { getGonpa } from "@/app/actions/getactions";
import { Card } from "@/components/ui/card";
import LoadingSkeleton from "./Skeleton";
import { getTranslations } from 'next-intl/server';
import { BACKGROUND_IMAGES, OTHER_SECTS, SECT_TRANSLATION_KEYS, isTibetanLocale } from "@/lib/utils";

const MAIN_SECTS = ['NYINGMA', 'KAGYU', 'SAKYA', 'GELUG', 'BHON', 'JONANG'];

type Monastery = {
  sect: string;
};

type SectGrouping = Record<string, Monastery[]>;
type LocaleProps = { locale: string };

export default function MonasteryDashboardPage({ params }: { params: LocaleProps }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MonasteryDashboardContent locale={params.locale} />
    </Suspense>
  );
}

const SectCard = ({
  sect,
  monasteries,
  locale,
  t,
  tCommon
}: {
  sect: string;
  monasteries: Monastery[];
  locale: string;
  t: (key: string) => string;
  tCommon: (key: string, values?: Record<string, string | number>) => string;
}) => {
  const getBackgroundImage = (sect: string) => {
    const lowerSect = sect.toLowerCase();
    return BACKGROUND_IMAGES[lowerSect as keyof typeof BACKGROUND_IMAGES];
  };

  return (
    <Link
      href={`/${locale}/Monastary/${sect}`}
      className="group block h-full w-full overflow-hidden"
    >
      <Card className="relative h-52 w-full overflow-hidden sm:h-60">
        <div className="relative w-full h-full">
          <Image
            src={getBackgroundImage(sect)}
            alt={`${sect} monastery background`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={75}
            priority={sect === MAIN_SECTS[0]}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10" />
        </div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
          <div className="space-y-2">
            <h3 className={`text-2xl font-semibold text-white ${
              isTibetanLocale(locale) ? 'font-monlam' : 'font-bold'
            }`}>
              {t(SECT_TRANSLATION_KEYS[sect as keyof typeof SECT_TRANSLATION_KEYS])}
            </h3>
            <p className="text-white/80 text-sm">
              {tCommon("monasteryCount", { count: monasteries.length })}
            </p>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm text-white backdrop-blur-sm">
              {tCommon("viewMonastery")}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const groupMonasteriesBySect = cache((monasteries: Monastery[]): SectGrouping => {
  const groupedData: SectGrouping = {};
  
  MAIN_SECTS.forEach(sect => {
    groupedData[sect] = monasteries.filter(m => m.sect === sect);
  });
  
  groupedData['OTHER'] = monasteries.filter(m => 
    !m.sect || 
    OTHER_SECTS.includes(m.sect)
  );
  
  return groupedData;
});

async function MonasteryDashboardContent({ locale }: LocaleProps) {
  const t = await getTranslations('monastery');
  const tCommon = await getTranslations('common');
  const gonpadata = await getGonpa() as Monastery[];
  const groupedMonasteries = groupMonasteriesBySect(gonpadata);
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedMonasteries).map(([sect, monasteries]) => (
          <SectCard
            key={sect}
            sect={sect}
            monasteries={monasteries}
            locale={locale}
            t={t}
            tCommon={tCommon}
          />
        ))}
      </div>
    </div>
  );
}