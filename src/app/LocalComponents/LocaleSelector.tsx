"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { usePathname } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSelector({ tibtext }: { tibtext: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const path = usePathname();
  const handleSelect = (nextLocale: string) => {
    startTransition(() => {
      const segments = path.split("/");
      const remainingPath = segments.slice(2).join("/") || "/";
      router.replace(`/${nextLocale}/${remainingPath}`);
    });
  };  
  const pathname = usePathname();
  const checkcolor = pathname === '/en' || pathname === '/bod';


  return (
    <Select
      value={localActive}
      onValueChange={handleSelect}
      disabled={isPending}
    >
      <SelectTrigger
        className={`${localActive === "bod" && "font-monlamuchen"} border-none  ${!checkcolor?" text-black bg-neutral-100/40 dark:bg-neutral-900 dark:hover:bg-neutral-950  dark:text-white":"text-white bg-neutral-100/40 "} w-[120px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none`}
      >
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className={` border-none ${!checkcolor?" text-black bg-neutral-100/40 dark:bg-neutral-900 dark:hover:bg-neutral-950  dark:text-white":"text-white  bg-neutral-100/40 "}`}>
        <SelectItem value="en">English</SelectItem>
        <SelectItem
          value="bod"
          className={`${localActive === "bod" && "font-monlamuchen"}`}
        >
          {tibtext}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
