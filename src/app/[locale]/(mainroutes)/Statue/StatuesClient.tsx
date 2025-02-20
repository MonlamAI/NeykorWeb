"use client";
import { useLocale } from "next-intl";
import React, { useState, useMemo, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SearchComponent } from "@/app/LocalComponents/Searchbar";
import { localeAlias } from "@/lib/utils";
import StatueCard from "@/app/LocalComponents/Cards/StatueCard";
import StatueFormModal from "./_Components/statueformmodal";
import { useRole } from "@/app/Providers/ContextProvider";

const ITEMS_PER_PAGE = 9;
const StatuesClient = ({ statuesData }: any) => {
  const activelocale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statues, setStatues] = useState(statuesData); 
 const {role}=useRole()
const isadmin = role === "ADMIN";
  const handleDeleteStatue = (deletedId: string) => {
    setStatues(prev => prev.filter((statue: any) => statue.id !== deletedId));
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
        <div className="flex  items-center ">
          <SearchComponent
            onSearch={handleSearch}
            placeholder="Search statues..."
            initialQuery={searchQuery}
          />
          {isadmin && (
            <StatueFormModal
            onSuccess={(newStatue: any) => {
              setStatues(prev => [newStatue, ...prev]);
              setSearchQuery("");
              }}
            />
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

            {totalPages > 1 && (
              <Pagination className="my-6">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem>
                  )}
                  {visiblePages.map((page, index) =>
                    typeof page === "string" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatuesClient;
