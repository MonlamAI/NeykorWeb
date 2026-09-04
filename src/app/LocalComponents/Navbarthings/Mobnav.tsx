"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import SessionControls from "../SessionControls";
import { isTibetanLocale } from "@/lib/utils";

const navlinks = [
  { key: "stas", href: "/Statue" },
  { key: "mons", href: "/Monastary" },
  { key: "fes", href: "/Festival" },
  { key: "sacred", href: "/Sacred" },
  { key: "cont", href: "/Contact" },
];

const MobileNav = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  const t = useTranslations("navbar");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="md:hidden fixed inset-0 z-[1100]">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      <div className="fixed inset-y-0 right-0 z-[1101] flex w-3/4 max-w-sm flex-col bg-background text-foreground shadow-2xl">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="flex flex-col gap-1">
            {navlinks.map((link) => {
              const active = pathname.includes(link.href);
              return (
                <Link
                  key={link.key}
                  href={`/${activeLocale}${link.href}`}
                  onClick={handleLinkClick}
                  className={`inline-flex h-10 items-center rounded-md px-3 py-2 text-sm transition-colors
                    ${isTibetanLocale(activeLocale) ? "font-monlam" : ""}
                    ${
                      active
                        ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                        : "text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:text-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
                    }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
            <div className="px-3 pt-3">
              <SessionControls />
            </div>
          </nav>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileNav;
