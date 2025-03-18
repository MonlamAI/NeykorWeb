"use client";
import { useLocale } from "next-intl";
import React, { useState, useMemo, useEffect } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import { localeAlias } from "@/lib/utils";
import StatueCard from "@/app/LocalComponents/Cards/StatueCard";
import StatueFormModal from "./_Components/statueformmodal";
import { useRole } from "@/app/Providers/ContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStatues } from "@/app/actions/getactions";

interface Statue {
  id: string;
  image: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Initialize with server-side data and then keep in sync with client-side
  const { data: statues = statuesData } = useQuery<Statue[], Error>({
    queryKey: ['statues'],
    queryFn: getStatues,
    initialData: statuesData,
  });

  const { role } = useRole();
  const isadmin = role === "ADMIN";

  const handleDeleteStatue = (deletedId: string) => {
    queryClient.setQueryData<Statue[]>(['statues'], (oldData) => 
      oldData?.filter(statue => statue.id !== deletedId) || []
    );
  };

  const filteredStatues = useMemo(() => {
    if (!searchQuery.trim()) return statues;

    return statues.filter((statue: any) => {
      const backendLocale = localeAlias[activelocale] || activelocale;
      const translation = statue.translations.find(
        (t: any) => t.languageCode === backendLocale
      ) ||
        statue.translations[0] || {
          name: "Unnamed Statue",
          description: "No description available",
        };

      const searchLower = searchQuery.toLowerCase();
      return translation.name.toLowerCase().includes(searchLower)
    });
  }, [statues, searchQuery, activelocale]);

  const totalPages = Math.ceil(filteredStatues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStatues = filteredStatues.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSuccess = (newStatue: Statue) => {
    queryClient.setQueryData(['statues'], (oldData: Statue[] | undefined) => [newStatue, ...(oldData || [])]);
    setSearchQuery("");
  };

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start <= end) {
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="relative min-h-screen w-full">
      <div className="sticky p-2 top-0 bg-white dark:bg-neutral-950 z-30 py-4 shadow-sm">
        <div className="flex items-center">
          <SearchComponent
            onSearch={handleSearch}
            placeholder="Search statues..."
            initialQuery={searchQuery}
          />
          {isadmin && (
            <StatueFormModal onSuccess={handleSuccess} />
          )}
        </div>
      </div>

      <div className="pt-4">
        {filteredStatues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No statues found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {currentStatues.map((statue: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation = statue.translations.find(
                  (t: any) => t.languageCode === backendLocale
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
              currentPage={currentPage}
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
