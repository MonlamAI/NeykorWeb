"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import MonasteryCard from "@/app/LocalComponents/Cards/MonasteryCard";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";
import { useListUrlState } from "@/hooks/useListUrlState";
import { localeAlias, sortListedContent, SECT_TRANSLATION_KEYS } from "@/lib/utils";
import MonsModal from "./MonsModal";
import { useRole } from "@/app/Providers/ContextProvider";

const ITEMS_PER_PAGE = 9;

const MonasterySectClient = ({
  monasteriesData,
  sect,
}: {
  monasteriesData: any[];
  sect: string;
}) => {
  const activelocale = useLocale();
  const tCommon = useTranslations("common");
  const tNav = useTranslations("navbar");
  const tMon = useTranslations("monastery");
  const { q, page, setQ, setPage, clearQ, clampPage } = useListUrlState();
  const { role } = useRole();
  const isadmin = role === "ADMIN";

  const [monastery, setmonastery] = useState(monasteriesData);

  const handledeletemons = (deletedId: string) => {
    setmonastery((prev) => prev.filter((mons: any) => mons.id !== deletedId));
  };

  const filteredMonasteries = useMemo(() => {
    return sortListedContent(
      monastery,
      q,
      (item: any) => item.translations,
      (item: any) =>
        (item.contact?.translations || []).flatMap((t: any) => [
          t.address,
          t.city,
          t.state,
          t.country,
        ])
    );
  }, [monastery, q]);

  const totalPages = Math.ceil(filteredMonasteries.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMonasteries = filteredMonasteries.slice(startIndex, endIndex);

  useEffect(() => {
    clampPage(totalPages);
  }, [totalPages, clampPage]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const sectKey =
    SECT_TRANSLATION_KEYS[sect.toUpperCase() as keyof typeof SECT_TRANSLATION_KEYS] ||
    "m10";
  const breadcrumbItems = [
    { label: tNav("mons"), href: "/Monastary" },
    { label: tMon(sectKey) },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="sticky top-0 z-30 bg-white py-4 dark:bg-neutral-950">
        <div className="flex items-center justify-between">
          <Breadcrumb
            items={breadcrumbItems}
            locale={activelocale}
            labels={{ home: tCommon("home") }}
          />
          <SearchComponent
            value={q}
            onChange={setQ}
            placeholder={tCommon("searchMonasteries")}
          />
          {isadmin && (
            <MonsModal
              id={sect}
              onSuccess={(newmons: any) => {
                setmonastery((prev) =>
                  sortListedContent(
                    [newmons, ...prev],
                    "",
                    (item: any) => item.translations
                  )
                );
                clearQ();
              }}
            />
          )}
        </div>
      </div>

      <div className="pt-4">
        {filteredMonasteries.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No monasteries found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
              {currentMonasteries.map((monastery: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation =
                  monastery.translations.find(
                    (t: any) => t.languageCode === backendLocale
                  ) ||
                  monastery.translations.find(
                    (t: any) => t.languageCode === "en"
                  ) ||
                  monastery.translations[0] || {
                    name: "Unnamed Monastery",
                    description: "No description available",
                  };
                const contactTranslation =
                  monastery.contact?.translations?.find(
                    (t: any) => t.languageCode === backendLocale
                  ) ||
                  monastery.contact?.translations?.find(
                    (t: any) => t.languageCode === "en"
                  ) ||
                  monastery.contact?.translations?.[0];

                return (
                  <MonasteryCard
                    key={monastery.id}
                    id={monastery.id}
                    sect={sect}
                    image={monastery.image}
                    translation={translation}
                    contactTranslation={contactTranslation}
                    type={monastery.type}
                    locale={activelocale}
                    onDelete={handledeletemons}
                    isAdmin={isadmin}
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
    </div>
  );
};

export default MonasterySectClient;
