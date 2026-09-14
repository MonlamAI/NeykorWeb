"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import { useListUrlState } from "@/hooks/useListUrlState";
import { localeAlias, sortListedContent } from "@/lib/utils";
import StatueCard from "@/app/LocalComponents/Cards/StatueCard";
import StatueFormModal from "./_Components/statueformmodal";
import { useRole } from "@/app/Providers/ContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStatues } from "@/app/actions/getactions";

interface Statue {
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

const ITEMS_PER_PAGE = 9;

const StatuesClient = ({ statuesData }: { statuesData: Statue[] }) => {
  const activelocale = useLocale();
  const tCommon = useTranslations("common");
  const { q, page, setQ, setPage, clearQ, clampPage } = useListUrlState();
  const queryClient = useQueryClient();
  const { data: statues = statuesData } = useQuery<Statue[], Error>({
    queryKey: ["statues"],
    queryFn: getStatues,
    initialData: statuesData,
  });

  const { role } = useRole();
  const isadmin = role === "ADMIN";

  const handleDeleteStatue = (deletedId: string) => {
    queryClient.setQueryData<Statue[]>(["statues"], (oldData) =>
      oldData?.filter((statue) => statue.id !== deletedId) || []
    );
  };

  const filteredStatues = useMemo(() => {
    return sortListedContent(statues, q, (statue) => statue.translations);
  }, [statues, q]);

  const totalPages = Math.ceil(filteredStatues.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStatues = filteredStatues.slice(startIndex, endIndex);

  useEffect(() => {
    clampPage(totalPages);
  }, [totalPages, clampPage]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const handleSuccess = (newStatue: Statue) => {
    queryClient.setQueryData(["statues"], (oldData: Statue[] | undefined) =>
      sortListedContent(
        [newStatue, ...(oldData || [])],
        "",
        (statue) => statue.translations
      )
    );
    clearQ();
  };

  return (
    <div className="relative w-full">
      <div className="sticky top-0 z-30 bg-white p-2 py-4 shadow-sm dark:bg-neutral-950">
        <div className="flex items-center">
          <SearchComponent
            value={q}
            onChange={setQ}
            placeholder={tCommon("searchStatues")}
          />
          {isadmin && <StatueFormModal onSuccess={handleSuccess} />}
        </div>
      </div>

      <div className="pt-4">
        {filteredStatues.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No statues found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
              {currentStatues.map((statue: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation =
                  statue.translations.find(
                    (t: any) => t.languageCode === backendLocale
                  ) ||
                  statue.translations.find(
                    (t: any) => t.languageCode === "en"
                  ) ||
                  statue.translations[0] || {
                    name: "Unnamed Statue",
                    description: "No description available",
                  };

                return (
                  <StatueCard
                    key={statue.id}
                    id={statue.id}
                    image={statue.image}
                    translation={translation}
                    locale={activelocale}
                    isAdmin={isadmin}
                    onDelete={handleDeleteStatue}
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

export default StatuesClient;
