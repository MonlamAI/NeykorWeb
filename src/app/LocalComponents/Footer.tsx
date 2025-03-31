'use client'
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname=usePathname()
  const checkcolor = pathname === '/en' || pathname === '/bod';
  return <div className={` text-sm ${!checkcolor?" text-black dark:text-white":"text-black "}`} >© 2025 Department of Religion & Culture, CTA.</div>;
};

export default Footer;
