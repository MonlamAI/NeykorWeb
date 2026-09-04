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
import { isHomePage, isTibetanLocale } from "@/lib/utils";

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
  const checkcolor = isHomePage(pathname);

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`${isTibetanLocale(localActive) ? "font-monlam" : ""} space-x-0`}
      >
        {navlinks.map((link) => (
          <NavigationMenuItem key={link.key}>
            <Link href={`/${localActive}${link.href}`} legacyBehavior passHref>
              <NavigationMenuLink
                className={twMerge(
                  navigationMenuTriggerStyle(),
                  isTibetanLocale(localActive) ? "font-monlam" : "",
                  "h-10 px-3 py-2 text-sm bg-transparent hover:bg-neutral-100/40",
                  checkcolor ? "text-neutral-800 hover:text-neutral-800" : "text-black dark:text-white"
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