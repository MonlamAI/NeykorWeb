'use client'

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();
  const checkcolor = pathname === '/en' || pathname === '/bod';
  
  return (
    <div className={`text-sm ${!checkcolor ? "text-black dark:text-white" : "text-black bg-[#EDE9E8]"} w-full flex items-center text-center justify-center`}>
      Department of Religion and Culture, Central Tibetan Administration
    </div>
  );
};

export default Footer;