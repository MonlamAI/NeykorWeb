"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { usePathname } from "@/i18n/routing";

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialQuery?: string;
  className?: string;
}

export const SearchComponent: React.FC<SearchProps> = ({
  onSearch,
  placeholder = "Search...",
  initialQuery = "",
  className = "",
}) => {
  const pathname = usePathname();
  const storageKey = `neykor.search:${pathname}`;
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved != null && saved !== "") {
      setSearchQuery(saved);
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(storageKey, searchQuery);
  }, [hydrated, storageKey, searchQuery]);

  useEffect(() => {
    if (!hydrated) return;
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [hydrated, searchQuery, onSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={`w-full max-w-xl mx-auto px-6 ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full"
      />
    </div>
  );
};
