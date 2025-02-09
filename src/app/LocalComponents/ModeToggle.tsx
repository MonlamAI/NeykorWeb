"use client";

import * as React from "react";
import { Moon, MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export function ModeToggle() {
  const { setTheme } = useTheme();
 const pathname=usePathname()
 const checkcolor = pathname === '/en' || pathname === '/bod';

  return (
    <DropdownMenu >
     <DropdownMenuTrigger className={` hover:bg-neutral-100/40 border-none ${!checkcolor?" text-black bg-neutral-100/40 dark:bg-neutral-900 dark:hover:bg-neutral-950  dark:text-white":"text-white bg-neutral-100/40 "}  focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none`} asChild>
  <Button size="icon" className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span className="sr-only">Toggle theme</span>
  </Button>
</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={` border-none ${!checkcolor?" text-black bg-neutral-100/40 dark:bg-neutral-900 dark:hover:bg-neutral-950  dark:text-white":"text-white  bg-neutral-100/40 "}`}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
