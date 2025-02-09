"use client";
import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

const navlinks = [
  { key: "stas", href: "/Statue" },
  { key: "mons", href: "/Monastary" },
  { key: "fes", href: "/Festival" },
  { key: "sacred", href: "/Sacred" },
  { key: "cont", href: "/Contact" },
];

const NavItems = () => {
  const t = useTranslations("navbar");
  const localActive = useLocale();
  const pathname = usePathname();
  const checkcolor = pathname === '/en' || pathname === '/bod';

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`${localActive == "bod" && "font-monlamuchen"}`}
      >
        {navlinks.map((link) => (
          <NavigationMenuItem key={link.key}>
            <Link href={`/${localActive}${link.href}`} legacyBehavior passHref>
              <NavigationMenuLink
                className={twMerge(
                  navigationMenuTriggerStyle(),
                  localActive == "bod" ? "text-lg" : "",
                  "bg-transparent hover:bg-neutral-100/40",
                  checkcolor ? "text-white hover:text-white" : "text-black dark:text-white"
                )}
              >
                {t(link.key)}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavItems;