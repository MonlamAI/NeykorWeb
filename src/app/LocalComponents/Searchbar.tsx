"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

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
