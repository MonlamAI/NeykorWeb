import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const ImageGallery = () => {
  const t = useTranslations('homescreen');
  const activelocale = useLocale();
  const images = [
    { src: '/Festivals.webp', alt: "image1", links: "/Festival", name: t('one') },
    { src: '/statues.webp', alt: "image2", links: "/Statue", name: t('two') },
    { src: '/monastery.webp', alt: "image3", links: "/Monastary", name: t('three') },
    { src: "/pilgrimage.webp", alt: "image4", links: "/Sacred", name: t('four') }
  ];

  return ( 
    <div className="hidden md:block">
      <div className="backdrop-blur-lg rounded-lg p-2 bg-white/80">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-44 h-40 overflow-hidden rounded-sm group"
            >
              <Link href={image.links} className="block w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 256px"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className={`absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-1 text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${activelocale=="bod" ? "font-monlamuchen" : ""}`}>
                  {image.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;