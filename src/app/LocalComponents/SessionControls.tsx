"use client";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { isTibetanLocale } from "@/lib/utils";

export default function SessionControls() {
  const { data: session, status } = useSession();
  const t = useTranslations("common");
  const locale = useLocale();

  if (status === "loading" || !session?.user) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`h-10 px-3 py-2 text-sm rounded-md inline-flex items-center gap-2 bg-neutral-200 hover:bg-neutral-300 text-black dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white ${
        isTibetanLocale(locale) ? "font-monlam" : ""
      }`}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {t("signOut")}
    </button>
  );
}
