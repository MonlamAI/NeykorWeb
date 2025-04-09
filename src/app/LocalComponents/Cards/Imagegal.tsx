import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const ImageGallery = () => {
  const t = useTranslations('homescreen');
  const activelocale = useLocale();
  
  const images = [
    { src: '/monastery.webp', alt: "monastery", links: "/Monastary", name: t('one') },
    { src: '/Festivals.webp', alt: "festivals", links: "/Festival", name: t('two') },
    { src: '/statues.webp', alt: "statues", links: "/Statue", name: t('three') },
    { src: '/pilgrimage.webp', alt: "pilgrimage", links: "/Sacred", name: t('four') }
  ];

  return (
    <div className=" max-w-6xl mx-auto px-4 hidden md:block">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-4">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            <Link href={image.links} className="block w-full">
              <div className="relative w-40 h-28">
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="object-cover rounded-md"
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <p className={`text-center text-black mt-2 text-sm ${activelocale === "bod" ? "font-monlamuchen" : ""}`}>
                {image.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;