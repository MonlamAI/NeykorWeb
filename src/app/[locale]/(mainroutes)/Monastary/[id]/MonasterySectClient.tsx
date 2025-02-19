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
import MonasteryCard from "@/app/LocalComponents/Cards/MonasteryCard";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";
import { localeAlias } from "@/lib/utils";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const {role}=useRole()
  const isadmin = useMemo(() => role === "ADMIN", [role]);

 const [monastery,setmonastery]=useState(monasteriesData);
 const handledeletemons = (deletedId: string) => {
  setmonastery(prev => prev.filter((mons: any) => mons.id !== deletedId));
};

  const filteredMonasteries = useMemo(() => {
    if (!searchQuery.trim()) return monastery;

    return monastery.filter((monastery: any) => {
      const backendLocale = localeAlias[activelocale] || activelocale;
      const translation = monastery.translations.find(
        (t: any) => t.languageCode === backendLocale
      ) ||
        monastery.translations[0] || {
          name: "Unnamed Monastery",
          description: "No description available",
        };

      const contactTranslation =
        monastery.contact?.translations?.find(
          (t: any) => t.languageCode === backendLocale
        ) || monastery.contact?.translations?.[0];

      const searchLower = searchQuery.toLowerCase();
      return translation.name.toLowerCase().includes(searchLower)
    });
  }, [monastery, searchQuery, activelocale]);

  const totalPages = Math.ceil(filteredMonasteries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMonasteries = filteredMonasteries.slice(startIndex, endIndex);

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
  const breadcrumbLabels = {
    en: { home: "Home", monasteries: "Monasteries", sect },
    bod: { home: "གཙོ་ངོས།", monasteries: "དགོན་པ།", sect },
  }[activelocale] || { home: "Home", monasteries: "Monasteries", sect };
  const breadcrumbItems = [
    { label: breadcrumbLabels.monasteries, href: "/Monastary" },
    { label: breadcrumbLabels.sect },
  ];
  return (
    <div className="container min-h-screen mx-auto py-8">
      <div className="sticky  top-0 bg-white dark:bg-neutral-950 z-30 py-4 ">
        <div className=" flex items-center justify-between ">
          <Breadcrumb
            items={breadcrumbItems}
            locale={activelocale}
            labels={{ home: breadcrumbLabels.home }}
          />

          <SearchComponent
            onSearch={handleSearch}
            placeholder="Search monasteries..."
            initialQuery={searchQuery}
          />
          {isadmin && (
            <MonsModal
            id={sect}
            onSuccess={(newmons: any) => {
              setmonastery(prev => [newmons, ...prev]);
              setSearchQuery("");
              }}
            />
          )}
        </div>

        <div />
      </div>

      <div className="pt-4">
        {filteredMonasteries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No monasteries found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {currentMonasteries.map((monastery: any) => {
                const backendLocale = localeAlias[activelocale] || activelocale;
                const translation = monastery.translations.find(
                  (t: any) => t.languageCode === backendLocale
                ) ||
                  monastery.translations[0] || {
                    name: "Unnamed Monastery",
                    description: "No description available",
                  };
                const contactTranslation =
                  monastery.contact?.translations?.find(
                    (t: any) => t.languageCode === backendLocale
                  ) || monastery.contact?.translations?.[0];

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

export default MonasterySectClient;
