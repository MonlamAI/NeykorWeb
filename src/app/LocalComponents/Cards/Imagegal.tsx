import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { isTibetanLocale } from "@/lib/utils";

const ImageGallery = () => {
  const t = useTranslations("homescreen");
  const activelocale = useLocale();

  const images = [
    { src: "/monastery.webp", alt: "monastery", links: "/Monastary", name: t("one") },
    { src: "/Festivals.webp", alt: "festivals", links: "/Festival", name: t("two") },
    { src: "/statues.webp", alt: "statues", links: "/Statue", name: t("three") },
    { src: "/pilgrimage.webp", alt: "pilgrimage", links: "/Sacred", name: t("four") },
  ];

  return (
    <nav className="w-full shrink-0 md:w-[min(100%,20rem)] lg:w-[22rem]">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {images.map((image) => (
          <Link
            key={image.links}
            href={`/${activelocale}${image.links}`}
            className="group flex flex-col items-center rounded-lg p-1 transition-colors hover:bg-neutral-50"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
              <Image
                src={image.src}
                alt={image.alt}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                fill
                priority
                sizes="(max-width: 768px) 45vw, 11rem"
              />
            </div>
            <p
              className={`mt-2 text-center text-sm text-black ${
                isTibetanLocale(activelocale) ? "font-monlam" : ""
              }`}
            >
              {image.name}
            </p>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default ImageGallery;
