"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { isHomePage, isTibetanLocale } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const checkcolor = isHomePage(pathname);
  const t = useTranslations("common");
  const locale = useLocale();
  const tibetan = isTibetanLocale(locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`hover:bg-neutral-100/40 border-none ${!checkcolor ? " text-black bg-neutral-100/40 dark:bg-neutral-900 dark:hover:bg-neutral-950  dark:text-white" : "text-black md:text-white bg-neutral-100/40 "}  focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none`}
        asChild
      >
        <Button
          size="icon"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`z-[1200] border-none bg-popover text-popover-foreground ${tibetan ? "font-monlam" : ""}`}
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
