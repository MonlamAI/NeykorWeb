import fs from "node:fs";
import path from "node:path";
import { contentLocale } from "@/lib/utils";

export const SCHOOL_SLUGS = [
  "nyingma",
  "kagyu",
  "sakya",
  "gelug",
  "bhon",
  "jonang",
] as const;

export type SchoolSlug = (typeof SCHOOL_SLUGS)[number];

export type SchoolCopy = {
  title: string;
  paragraphs: string[];
};

export type SchoolArticle = {
  slug: SchoolSlug;
  sourceEn: string;
  sourceBo: string;
  translations: {
    en: SchoolCopy;
    bo: SchoolCopy;
  };
};

export function isSchoolSlug(value: string): value is SchoolSlug {
  return (SCHOOL_SLUGS as readonly string[]).includes(value);
}

export function getSchool(slug: string): SchoolArticle | null {
  if (!isSchoolSlug(slug)) return null;
  const file = path.join(process.cwd(), "src/content/schools", `${slug}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8")) as SchoolArticle;
}

export function schoolCopyForLocale(
  school: SchoolArticle,
  uiLocale: string
): SchoolCopy {
  const code = contentLocale(uiLocale);
  if (code === "bo" && school.translations.bo?.paragraphs?.length) {
    return school.translations.bo;
  }
  return school.translations.en;
}
