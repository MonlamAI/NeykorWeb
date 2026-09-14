"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import { useListUrlState } from "@/hooks/useListUrlState";
import { localeAlias, sortListedContent } from "@/lib/utils";
import FestivalCard from "@/app/LocalComponents/Cards/Festivalcard";
import { useRole } from "@/app/Providers/ContextProvider";
import FestModal from "./FestModal";

const ITEMS_PER_PAGE = 9;

interface Festival {
  id: string;
  image: string;
  createdAt?: string;
  translations: Array<{
    languageCode: string;
    name: string;
    description: string;
    description_audio: string;
  }>;
}

const FestivalClient = ({ fesdata }: { fesdata: Festival[] }) => {
  const activelocale = useLocale();
  const tCommon = useTranslations("common");
  const { q, page, setQ, setPage, clearQ, clampPage } = useListUrlState();
  const [festival, setfestival] = useState<Festival[]>(fesdata);
  const { role } = useRole();
  const isadmin = role === "ADMIN";

  useEffect(() => {
    setfestival(fesdata);
  }, [fesdata]);

  const handledeletefestival = (deletedId: string) => {
    setfestival((prev: Festival[]) => prev.filter((fes) => fes.id !== deletedId));
  };

  const filteredfestival = useMemo(() => {
    return sortListedContent(festival, q, (fes) => fes.translations);
  }, [festival, q]);

  const totalPages = Math.ceil(filteredfestival.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentfes = filteredfestival.slice(startIndex, endIndex);

  useEffect(() => {
    clampPage(totalPages);
  }, [totalPages, clampPage]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="relative w-full">
      <div className="sticky top-0 z-30 bg-white py-4 shadow-sm dark:bg-neutral-950">
        <div className="flex items-center justify-between px-6">
          <SearchComponent
            value={q}
            onChange={setQ}
            placeholder={tCommon("searchFestivals")}
          />
          {isadmin && (
            <FestModal
              onSuccess={() => {
                clearQ();
              }}
            />
          )}
        </div>
      </div>

      <div className="pt-4">
        {filteredfestival.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No festivals found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
              {currentfes.map((fes: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation =
                  fes.translations.find(
                    (t: any) => t.languageCode === backendLocale
                  ) ||
                  fes.translations.find((t: any) => t.languageCode === "en") ||
                  fes.translations[0] || {
                    name: "Unnamed Festival",
                    description: "No description available",
                  };

                return (
                  <FestivalCard
                    key={fes.id}
                    id={fes.id}
                    image={fes.image}
                    translation={translation}
                    locale={activelocale}
                    isadmin={isadmin}
                    onDelete={handledeletefestival}
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

export default FestivalClient;
