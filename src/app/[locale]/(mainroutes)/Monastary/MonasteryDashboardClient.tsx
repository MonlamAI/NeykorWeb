"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import MonasteryCard from "@/app/LocalComponents/Cards/MonasteryCard";
import { Card } from "@/components/ui/card";
import { useListUrlState } from "@/hooks/useListUrlState";
import {
  isTibetanLocale,
  localeAlias,
  MAIN_SECTS,
  OTHER_SECTS,
  SECT_TRANSLATION_KEYS,
  sortListedContent,
} from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

type Monastery = {
  id: string;
  sect?: string;
  image?: string;
  type?: string;
  translations: Array<{ languageCode: string; name: string; description: string }>;
  contact?: {
    translations?: Array<{
      languageCode: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postal_code?: string;
    }>;
  };
};

function groupMonasteriesBySect(monasteries: Monastery[]) {
  const grouped: Record<string, Monastery[]> = {};
  MAIN_SECTS.forEach((sect) => {
    grouped[sect] = monasteries.filter((m) => m.sect === sect);
  });
  grouped.OTHER = monasteries.filter(
    (m) => !m.sect || OTHER_SECTS.includes(m.sect)
  );
  return grouped;
}

function monasterySectRoute(monastery: Monastery): string {
  if (
    monastery.sect &&
    (MAIN_SECTS as readonly string[]).includes(monastery.sect)
  ) {
    return monastery.sect;
  }
  return "OTHER";
}

const SectCard = ({
  sect,
  monasteries,
  locale,
  image,
}: {
  sect: string;
  monasteries: Monastery[];
  locale: string;
  image?: string;
}) => {
  const t = useTranslations("monastery");
  const tCommon = useTranslations("common");

  return (
    <Link
      href={`/${locale}/Monastary/${sect}`}
      className="group block h-full w-full overflow-hidden"
    >
      <Card className="relative h-52 w-full overflow-hidden sm:h-60">
        <div className="relative h-full w-full">
          {image ? (
            <Image
              src={image}
              alt={`${sect} monastery background`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={75}
              priority={sect === MAIN_SECTS[0]}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
          <div className="space-y-2">
            <h3
              className={`text-2xl font-semibold text-white ${
                isTibetanLocale(locale) ? "font-monlam" : "font-bold"
              }`}
            >
              {t(
                SECT_TRANSLATION_KEYS[
                  sect as keyof typeof SECT_TRANSLATION_KEYS
                ]
              )}
            </h3>
            <p className="text-sm text-white/80">
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

type BackgroundImages = Record<string, string>;

export default function MonasteryDashboardClient({
  monasteries,
  backgroundImages,
}: {
  monasteries: Monastery[];
  backgroundImages: BackgroundImages;
}) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const { q, page, setQ, setPage, clampPage } = useListUrlState();
  const [items, setItems] = useState(monasteries);

  useEffect(() => {
    setItems(monasteries);
  }, [monasteries]);

  const groupedMonasteries = useMemo(
    () => groupMonasteriesBySect(items),
    [items]
  );

  const filteredMonasteries = useMemo(() => {
    return sortListedContent(
      items,
      q,
      (item) => item.translations,
      (item) =>
        (item.contact?.translations || []).flatMap((t) => [
          t.address,
          t.city,
          t.state,
          t.country,
        ])
    );
  }, [items, q]);

  const isSearching = q.trim().length > 0;
  const totalPages = Math.ceil(filteredMonasteries.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentMonasteries = filteredMonasteries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    clampPage(totalPages);
  }, [totalPages, clampPage]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const backendLocale = localeAlias[locale] || locale;

  return (
    <div className="w-full">
      <div className="sticky top-0 z-30 bg-white py-4 dark:bg-neutral-950">
        <SearchComponent
          value={q}
          onChange={setQ}
          placeholder={tCommon("searchMonasteries")}
        />
      </div>

      {isSearching ? (
        <div className="pt-4">
          {filteredMonasteries.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No monasteries found matching your search.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                {currentMonasteries.map((monastery) => {
                  const translation =
                    monastery.translations.find(
                      (t) => t.languageCode === backendLocale
                    ) ||
                    monastery.translations.find(
                      (t) => t.languageCode === "en"
                    ) ||
                    monastery.translations[0] || {
                      name: "Unnamed Monastery",
                      description: "No description available",
                    };
                  const contactTranslation =
                    monastery.contact?.translations?.find(
                      (t) => t.languageCode === backendLocale
                    ) ||
                    monastery.contact?.translations?.find(
                      (t) => t.languageCode === "en"
                    ) ||
                    monastery.contact?.translations?.[0];

                  return (
                    <MonasteryCard
                      key={monastery.id}
                      id={monastery.id}
                      sect={monasterySectRoute(monastery)}
                      image={monastery.image}
                      translation={translation}
                      contactTranslation={contactTranslation}
                      type={monastery.type}
                      locale={locale}
                    />
                  );
                })}
              </div>
              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="my-6"
              />
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedMonasteries).map(([sect, sectMonasteries]) => (
            <SectCard
              key={sect}
              sect={sect}
              monasteries={sectMonasteries}
              locale={locale}
              image={
                backgroundImages[
                  sect.toLowerCase() as keyof typeof backgroundImages
                ]
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
