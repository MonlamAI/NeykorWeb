"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface SearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchComponent: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  debounceMs = 300,
}) => {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (draft !== value) {
        onChange(draft);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [draft, debounceMs, onChange, value]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  return (
    <div className={`w-full max-w-xl mx-auto px-6 ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={draft}
        onChange={handleSearchChange}
        className="w-full"
      />
    </div>
  );
};
