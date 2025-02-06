import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MonasteryCard = ({
  id,
  sect,
  image,
  translation,
  contactTranslation,
  type,
  locale = "en",
  className = "",
}: any) => {
  return (
    <Link href={`/Monastary/${sect}/${id}`}>
      <Card
        className={`overflow-hidden hover:shadow-lg dark:bg-neutral-900 h-full transition-shadow ${className} `}
      >
        <div className="relative w-full h-48">
          {image &&
           (
            image.startsWith("https://gompa-tour.s3.ap-south-1.amazonaws.com") ||
            image.startsWith("https://monlam-ai-web-testing.s3.ap-south-1.amazonaws.com")
          ) 
          ? (
            <Image
              src={image}
              alt={translation.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-gray-300">
              <span className="text-lg">No Image Available</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3
              className={`text-lg font-semibold dark:text-neutral-300 text-neutral-800 ${
                locale === "bod" ? "font-monlamuchen" : ""
              }`}
            >
              {translation.name}
            </h3>
            <Badge variant="secondary">{type}</Badge>
          </div>
          <p
            className={`text-gray-600 dark:text-neutral-400 line-clamp-3 ${
              locale === "bod" ? "font-monlamuchen" : ""
            }`}
          >
            {translation.description}
          </p>
          {contactTranslation && (
            <div className="mt-2 text-sm text-gray-500">
              <p>
                {contactTranslation.address}, {contactTranslation.city}
              </p>
              <p>
                {contactTranslation.state}, {contactTranslation.postal_code}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default MonasteryCard;
