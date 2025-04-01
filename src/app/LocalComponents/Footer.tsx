'use client'

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();
  const checkcolor = pathname === '/en' || pathname === '/bod';
  
  return (
    <div className={`text-sm ${!checkcolor ? "text-black dark:text-white" : "text-black bg-[#EDE9E8]"} w-full flex items-center justify-center`}>
      © 2025 Department of Religion & Culture, CTA.
    </div>
  );
};

export default Footer;