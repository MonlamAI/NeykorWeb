'use client'

import React from "react";
import { isTibetanLocale } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <footer
      className={`mt-auto w-full py-4 px-4 text-sm text-center text-black dark:text-white ${
        isTibetanLocale(locale) ? "font-monlam" : ""
      }`}
    >
      {tCommon("deptName")}
    </footer>
  );
};

export default Footer;
