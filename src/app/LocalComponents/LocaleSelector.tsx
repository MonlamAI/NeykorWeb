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

  return (
    <Select
      value={localActive}
      onValueChange={handleSelect}
      disabled={isPending}
    >
      <SelectTrigger
        className={`${localActive === "bod" && "font-monlamuchen"} w-[120px]`}
      >
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
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
