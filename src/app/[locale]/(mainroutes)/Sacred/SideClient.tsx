"use client";

import { useLocale } from "next-intl";
import React, { useState, useMemo, useEffect } from "react";
import CustomPagination from "@/app/LocalComponents/CustomPagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import { localeAlias } from "@/lib/utils";
import PilgrimSiteCard from "@/app/LocalComponents/Cards/Pligrimcard";
import SacredModal from "./SacredModal";
import { useRole } from "@/app/Providers/ContextProvider";

const ITEMS_PER_PAGE = 9;
const SideClient = ({ pilgrimData }: any) => {
  const activelocale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const {role} = useRole();
  const isadmin = role === "ADMIN";
  const [searchQuery, setSearchQuery] = useState("");
  const [place, setplace] = useState<any[]>(pilgrimData);

  const handleDeleteStatue = (deletedId: string) => {
    setplace((prev: any[]) => prev.filter((places) => places.id !== deletedId));
  };

  useEffect(() => {
    setplace(pilgrimData);
  }, [pilgrimData]);

  const filteredPilgrimSites = useMemo(() => {
    if (!searchQuery.trim()) return place;

    return place.filter((site: any) => {
      const backendLocale = localeAlias[activelocale] || activelocale;
      const translation = site.translations.find(
        (t: any) => t.languageCode === backendLocale
      ) ||
        site.translations[0] || {
          name: "Unnamed Site",
          description: "No description available",
        };

      const searchLower = searchQuery.toLowerCase();
      return translation.name.toLowerCase().includes(searchLower)
       
    });
  }, [place, searchQuery, activelocale]);

  const totalPages = Math.ceil(filteredPilgrimSites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSites = filteredPilgrimSites.slice(startIndex, endIndex);

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
      <div className="sticky top-0 bg-white dark:bg-neutral-950 z-10 py-4 shadow-sm">
        <div className="flex items-center justify-between px-2">
          <SearchComponent
            onSearch={handleSearch}
            placeholder="Search pilgrim sites..."
            initialQuery={searchQuery}
          />
          {isadmin && (
            <SacredModal
              onSuccess={(newplace: any) => {
                setplace((prev: any[]) => [newplace, ...prev]);
                setSearchQuery("");
              }}
            />
          )}
        </div>
      </div>

      <div className="pt-4">
        {filteredPilgrimSites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pilgrim sites found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {currentSites.map((site: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation = site.translations.find(
                  (t: any) => t.languageCode === backendLocale
                ) ||
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

export default SideClient;
