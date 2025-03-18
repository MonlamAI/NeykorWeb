"use client";
import { useLocale } from "next-intl";
import React, { useState, useMemo, useEffect } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import { localeAlias } from "@/lib/utils";
import FestivalCard from "@/app/LocalComponents/Cards/Festivalcard";
import { useRole } from "@/app/Providers/ContextProvider";
import FestModal from "./FestModal";
const ITEMS_PER_PAGE = 9;

interface Festival {
  id: string;
  image: string;
  translations: Array<{
    languageCode: string;
    name: string;
    description: string;
    description_audio: string;
  }>;
}

const FestivalClient = ({ fesdata }: { fesdata: Festival[] }) => {
  const activelocale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
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
    if (!searchQuery.trim()) return festival;

    return festival.filter((fes: any) => {
      const backendLocale = localeAlias[activelocale] || activelocale;
      const translation = fes.translations.find(
        (t: any) => t.languageCode === backendLocale
      ) ||
        fes.translations[0] || {
          name: "Unnamed fes",
          description: "No description available",
        };

      const searchLower = searchQuery.toLowerCase();
      return translation.name.toLowerCase().includes(searchLower)
    });
  }, [festival, searchQuery, activelocale]);

  const totalPages = Math.ceil(filteredfestival.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentfes = filteredfestival.slice(startIndex, endIndex);

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
      <div className="sticky top-0 bg-white dark:bg-neutral-950 z-30 py-4 shadow-sm">
        <div className=" flex justify-between items-center px-6">
        <SearchComponent
          onSearch={handleSearch}
          placeholder="Search festivals..."
          initialQuery={searchQuery}
        />
          {isadmin && (
            <FestModal
              onSuccess={(newfes: any) => {
                setSearchQuery("");
              }}
            />
          )}
        </div>
      </div>

      <div className="pt-4">
        {filteredfestival.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No festivals found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {currentfes.map((fes: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation = fes.translations.find(
                  (t: any) => t.languageCode === backendLocale
                ) ||
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

export default FestivalClient;
