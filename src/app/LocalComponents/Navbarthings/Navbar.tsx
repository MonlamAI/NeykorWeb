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
import { usePathname } from "next/navigation";
import MobileNav from "./Mobnav";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navbar");
  const activeLocale = useLocale();
  const pathname=usePathname()
  const checkcolor = pathname === '/en' || pathname === '/bod';

  return (
    <nav className="w-full">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-x-2">
            <Image src={iconimage} height={35} width={35} alt="icon" />
            <Link href={`/${activeLocale}`} className="max-w-sm">
              <h1
                className={`text-lg font-semibold hidden md:block ${!checkcolor?" text-black dark:text-white":"text-white "} ${
                  activeLocale === "bod"
                    ? "font-tsumachu"
                    : "uppercase font-bold"
                }`}
              >
                {t("name")}
              </h1>
            </Link>
            <div className="hidden lg:block max-w-xs border-l-2 px-2 text-start">
              <h2 className={`text-xs ${!checkcolor?" text-black dark:text-white":"text-white "}  font-medium`}>
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
                <X className={`w-6 h-6 ${!checkcolor?" text-black dark:text-white":"text-white "}`}  />
              ) : (
                <Menu className={`w-6 h-6 ${!checkcolor?" text-black dark:text-white":"text-white "}`}  />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <MobileNav setIsOpen={setIsOpen}/>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
