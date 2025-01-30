import React from "react";
import { LocaleSelector } from "../LocaleSelector";
import { useLocale, useTranslations } from "next-intl";
import UserProfile from "../UserProfile";
import NavItems from "./NavItems";
import Link from "next/link";

const Navbar = () => {
  const t = useTranslations("navbar");
  const activelocale = useLocale();

  return (
    <div className="flex items-center w-full justify-around">
      <Link href="/">
        <p className={`${activelocale == "bod" && "font-tsumachu "} p-2`}>
          {t("name")}
        </p>
      </Link>

      <div className="flex items-center space-x-4">
        <NavItems />
      </div>

      <div className="flex items-center space-x-2">
        <LocaleSelector tibtext={t("tibetan")} />
        <UserProfile />
      </div>
    </div>
  );
};

export default Navbar;
