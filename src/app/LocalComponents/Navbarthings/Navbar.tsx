"use client";
import React, { useState } from "react";
import { LocaleSelector } from "../LocaleSelector";
import { useLocale, useTranslations } from "next-intl";
import NavItems from "./NavItems";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import iconimage from "@/public/icon.png";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navbar");
  const activeLocale = useLocale();

  return (
    <nav className="w-full bg-white dark:bg-neutral-950 shadow">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-x-2">
            <Image src={iconimage} height={35} width={35} alt="icon" />
            <Link href="/" className="max-w-sm">
              <h1
                className={`text-lg font-semibold ${
                  activeLocale === "bod"
                    ? "font-tsumachu"
                    : "uppercase font-bold"
                }`}
              >
                {t("name")}
              </h1>
            </Link>
            <div className="hidden lg:block max-w-xs border-l-2 px-2 text-start">
              <h2 className="text-xs font-medium">
                Department of Religion and Culture <br /> Central Tibetan
                Administration
              </h2>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
            <LocaleSelector tibtext={t("tibetan")} />
            <ModeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <LocaleSelector tibtext={t("tibetan")} />
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col items-start space-y-2">
              <NavItems />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
