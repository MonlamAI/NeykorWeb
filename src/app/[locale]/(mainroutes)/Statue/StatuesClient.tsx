"use client";

import { useLocale } from "next-intl";
import React, { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const localeAlias: { [key: string]: string } = {
  bod: "bo",
};

const ITEMS_PER_PAGE = 9;

const StatuesClient = ({ statuesData }: any) => {
  const activelocale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(statuesData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStatues = statuesData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
            <div
              key={statue.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {statue.image && (
                <img
                  src={statue.image}
                  alt={translation.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {translation.name}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {translation.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
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
    </>
  );
};

export default StatuesClient;
