import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
const ImageGallery = () => {
  const t = useTranslations('index');
  
  const images = [
    { src: '/Festivals.webp', alt: "image1",links:"/Festival"  },
    { src: '/statues.webp', alt: "image2",links:"/Statue"  },
    { src: '/monastery.webp', alt: "image3",links:"/Monastary"},
    {src:"/pilgrimage.webp", alt:"image4",links:"/Sacred"}
  ];

  
  return ( 
    <div className="absolute bottom-5  right-4 hidden md:block">
      <div className="  backdrop-blur-lg rounded-lg p-2">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-32 h-16 overflow-hidden rounded-sm hover:opacity-80 transition-opacity"
              >
                <Link href={image.links}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="object-cover"
                  fill
                  priority
                  sizes="64px"
                />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;