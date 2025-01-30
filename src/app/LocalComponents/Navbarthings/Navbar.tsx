import React from "react";
import { LocaleSelector } from "../LocaleSelector";
import { useLocale, useTranslations } from "next-intl";
import UserProfile from "../UserProfile";
import NavItems from "./NavItems";
import Link from "next/link";

const Navbar = () => {
  const t = useTranslations("navbar");
  const activeLocale = useLocale();

  return (
    <nav className="w-full ">
      <div className=" mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-x-2">
            <Link href="/" className="max-w-sm">
              <h1
                className={`text-lg font-semibold  ${
                  activeLocale == "bod"
                    ? "font-tsumachu"
                    : " uppercase font-bold"
                }`}
              >
                {t("name")}
              </h1>
            </Link>
            <div className="hidden md:block max-w-xs  border-l-2 px-2 text-start">
              <h2 className="text-xs font-medium ">
                Department of Religion and Culture <br /> Central Tibetan
                Administration
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NavItems />
            <LocaleSelector tibtext={t("tibetan")} />
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
