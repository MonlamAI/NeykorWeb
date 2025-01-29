import React from "react";
import { LocaleSelector } from "./LocaleSelector";
import { useTranslations } from "next-intl";

const Navbar = () => {
  const t = useTranslations("navbar");
  return (
    <div className=" flex items-center w-full justify-between">
      <p>Neykor</p>
      <LocaleSelector tibtext={t("tibetan")} />
    </div>
  );
};

export default Navbar;
