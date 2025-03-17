"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UserProfile() {
  const { user, error, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
    if (event.key === "Enter" || event.key === " ") {
      setIsOpen((prev) => !prev);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg" role="alert">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 h-[40px] w-[160px]">
        <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
        <div className="flex-1 h-4 bg-neutral-200 rounded animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center space-x-2 h-[40px] w-[160px] px-3 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="User menu"
        >
          <img
            src={user.picture || ""}
            alt={`${user.name}'s profile`}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium truncate">{user.name}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-neutral-200">
            <div className="px-4 py-2 text-sm text-neutral-500 border-b border-neutral-200">
              My Account
            </div>
            <Link
              href="/api/auth/logout"
              className="flex items-center justify-between px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <span>Logout</span>
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/api/auth/login"
      className="inline-flex items-center justify-center h-[40px] w-[160px] rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Login
    </Link>
  );
}
