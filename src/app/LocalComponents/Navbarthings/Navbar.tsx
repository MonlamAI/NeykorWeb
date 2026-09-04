"use client";
import React, { useEffect, useState } from "react";
import { LocaleSelector } from "../LocaleSelector";
import { useLocale, useTranslations } from "next-intl";
import NavItems from "./NavItems";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import iconimage from "../../../../public/icon.webp";
import { usePathname } from "next/navigation";
import MobileNav from "./Mobnav";
import SessionControls from "../SessionControls";
import { isHomePage, isTibetanLocale } from "@/lib/utils";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navbar");
  const activeLocale = useLocale();
  const pathname = usePathname()
  const checkcolor = isHomePage(pathname);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="relative z-50 w-full">
      <div className="mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${activeLocale}`} >
            <div className="flex items-center gap-x-2">
              <Image src={iconimage} height={35} width={35} alt="icon" />

              <h1
                className={`text-lg max-w-sm font-semibold hidden md:block ${!checkcolor ? " text-black dark:text-white" : "text-black "} ${isTibetanLocale(activeLocale)
                  ? "font-tsumachu pt-3"
                  : "uppercase font-bold"
                  }`}
              >
                {t("name")}
              </h1>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavItems />
            <LocaleSelector tibtext={t("tibetan")} />
            <ModeToggle />
            <SessionControls />
          </div>

          <div className="md:hidden flex items-center space-x-1">
            <LocaleSelector tibtext={t("tibetan")} />
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md focus:outline-none"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className={`w-6 h-6 ${!checkcolor ? " text-black dark:text-white" : "text-black md:text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${!checkcolor ? " text-black dark:text-white" : "text-black md:text-white"}`} />
              )}
            </button>
          </div>

        </div>

        {isOpen && (
          <MobileNav setIsOpen={setIsOpen} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
