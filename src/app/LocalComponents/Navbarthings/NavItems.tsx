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

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`${localActive == "bod" && " font-monlamuchen"}`}
      >
        {navlinks.map((link) => (
          <NavigationMenuItem key={link.key}>
            <Link href={`/${localActive}${link.href}`} legacyBehavior passHref>
              {/* Added text-xl class to increase font size */}
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()}  ${
                  localActive == "bod" && "text-lg"
                }`}
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
