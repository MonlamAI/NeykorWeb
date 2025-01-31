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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const localeAlias: { [key: string]: string } = {
  bod: "bo",
};

const ITEMS_PER_PAGE = 8;

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

  const filteredMonasteries = useMemo(() => {
    if (!searchQuery.trim()) return monasteriesData;

    return monasteriesData.filter((monastery: any) => {
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
      return (
        translation.name.toLowerCase().includes(searchLower) ||
        translation.description.toLowerCase().includes(searchLower) ||
        contactTranslation?.address.toLowerCase().includes(searchLower) ||
        contactTranslation?.city.toLowerCase().includes(searchLower)
      );
    });
  }, [monasteriesData, searchQuery, activelocale]);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">{sect.toUpperCase()} Monasteries</h1>
        <Link href="/Monastary">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
            Back to Directory
          </button>
        </Link>
      </div>

      <div className="sticky top-0 bg-white z-10 py-4 shadow-sm">
        <div className="w-full max-w-xl mx-auto">
          <Input
            type="search"
            placeholder="Search monasteries..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="pt-4">
        {filteredMonasteries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No monasteries found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Link
                    href={`/Monastary/${sect}/${monastery.id}`}
                    key={monastery.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative w-full h-48">
                      {monastery.image &&
                      monastery.image.startsWith(
                        "https://gompa-tour.s3.ap-south-1.amazonaws.com"
                      ) ? (
                        <Image
                          src={monastery.image}
                          alt={translation.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/path/to/fallback-image.jpg";
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900"
                          aria-label={`Placeholder image for ${translation.name}`}
                        ></div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={`text-lg font-semibold text-neutral-800 ${
                            activelocale == "bod" && "font-monlamuchen"
                          }`}
                        >
                          {translation.name}
                        </h3>
                        <Badge variant="secondary">{monastery.type}</Badge>
                      </div>
                      <p
                        className={`text-gray-600 line-clamp-3 ${
                          activelocale == "bod" && "font-monlamuchen"
                        }`}
                      >
                        {translation.description}
                      </p>
                      {contactTranslation && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p>
                            {contactTranslation.address},{" "}
                            {contactTranslation.city}
                          </p>
                          <p>
                            {contactTranslation.state},{" "}
                            {contactTranslation.postal_code}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
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
