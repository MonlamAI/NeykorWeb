'use client'

import { usePathname } from "next/navigation";
import React from "react";
import { isHomePage } from "@/lib/utils";

const Footer = () => {
  const pathname = usePathname();
  const checkcolor = isHomePage(pathname);
  
  return (
    checkcolor ? null : (
      <div className="text-sm text-black dark:text-white w-full flex items-center text-center justify-center">
        Department of Religion and Culture, Central Tibetan Administration
      </div>
    )
  );
};

export default Footer;