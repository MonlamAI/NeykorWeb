import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";
import {
  BACKGROUND_IMAGES,
  SECT_TRANSLATION_KEYS,
  isTibetanLocale,
} from "@/lib/utils";
import {
  getSchool,
  schoolCopyForLocale,
  type SchoolSlug,
} from "@/lib/schools";

export default async function SchoolPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  setRequestLocale(params.locale);
  const school = getSchool(params.slug);
  if (!school) notFound();

  const locale = params.locale;
  const slug = school.slug as SchoolSlug;
  const copy = schoolCopyForLocale(school, locale);
  const tCommon = await getTranslations("common");
  const tMon = await getTranslations("monastery");
  const sectKey =
    SECT_TRANSLATION_KEYS[
      slug.toUpperCase() as keyof typeof SECT_TRANSLATION_KEYS
    ] || "m10";
  const shortName = tMon(sectKey);
  const image = BACKGROUND_IMAGES[slug];
  const tibetan = isTibetanLocale(locale);
  const bodyClass = tibetan
    ? "font-monlam text-base leading-loose"
    : "text-base leading-7";

  return (
    <article className="container mx-auto max-w-3xl pb-16">
      <Breadcrumb
        items={[{ label: shortName }]}
        locale={locale}
        labels={{ home: tCommon("home") }}
      />
      {image ? (
        <div className="relative mb-8 h-52 w-full overflow-hidden rounded-xl sm:h-72">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <h1
            className={`absolute bottom-4 left-4 right-4 text-2xl text-white sm:text-3xl ${
              tibetan ? "font-monlam" : "font-semibold"
            }`}
          >
            {shortName}
          </h1>
        </div>
      ) : (
        <h1
          className={`mb-6 text-2xl sm:text-3xl ${
            tibetan ? "font-monlam" : "font-semibold"
          }`}
        >
          {shortName}
        </h1>
      )}
      {copy.title && copy.title !== shortName ? (
        <p
          className={`mb-6 text-neutral-600 dark:text-neutral-300 ${
            tibetan ? "font-monlam text-sm leading-relaxed" : "text-sm"
          }`}
        >
          {copy.title}
        </p>
      ) : null}
      <div className={`space-y-5 text-neutral-800 dark:text-neutral-200 ${bodyClass}`}>
        {copy.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
