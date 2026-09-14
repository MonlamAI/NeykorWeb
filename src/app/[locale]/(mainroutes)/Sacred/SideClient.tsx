"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import { useListUrlState } from "@/hooks/useListUrlState";
import { localeAlias, sortListedContent } from "@/lib/utils";
import PilgrimSiteCard from "@/app/LocalComponents/Cards/Pligrimcard";
import SacredModal from "./SacredModal";
import { useRole } from "@/app/Providers/ContextProvider";

const ITEMS_PER_PAGE = 9;

const SideClient = ({ pilgrimData }: any) => {
  const activelocale = useLocale();
  const tCommon = useTranslations("common");
  const { q, page, setQ, setPage, clearQ, clampPage } = useListUrlState();
  const { role } = useRole();
  const isadmin = role === "ADMIN";
  const [place, setplace] = useState<any[]>(pilgrimData);

  const handleDeleteStatue = (deletedId: string) => {
    setplace((prev: any[]) => prev.filter((places) => places.id !== deletedId));
  };

  useEffect(() => {
    setplace(pilgrimData);
  }, [pilgrimData]);

  const filteredPilgrimSites = useMemo(() => {
    return sortListedContent(place, q, (site) => site.translations);
  }, [place, q]);

  const totalPages = Math.ceil(filteredPilgrimSites.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSites = filteredPilgrimSites.slice(startIndex, endIndex);

  useEffect(() => {
    clampPage(totalPages);
  }, [totalPages, clampPage]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="relative w-full">
      <div className="sticky top-0 z-10 bg-white py-4 shadow-sm dark:bg-neutral-950">
        <div className="flex items-center justify-between px-2">
          <SearchComponent
            value={q}
            onChange={setQ}
            placeholder={tCommon("searchSites")}
          />
          {isadmin && (
            <SacredModal
              onSuccess={(newplace: any) => {
                setplace((prev: any[]) =>
                  sortListedContent(
                    [newplace, ...prev],
                    "",
                    (site) => site.translations
                  )
                );
                clearQ();
              }}
            />
          )}
        </div>
      </div>

      <div className="pt-4">
        {filteredPilgrimSites.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No pilgrim sites found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
              {currentSites.map((site: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation =
                  site.translations.find(
                    (t: any) => t.languageCode === backendLocale
                  ) ||
                  site.translations.find((t: any) => t.languageCode === "en") ||
                  site.translations[0] || {
                    name: "Unnamed Site",
                    description: "No description available",
                  };

                return (
                  <PilgrimSiteCard
                    key={site.id}
                    id={site.id}
                    image={site.image}
                    translation={translation}
                    locale={activelocale}
                    isadmin={isadmin}
                    ondelelte={handleDeleteStatue}
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

export default SideClient;
