import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const StatueCard = ({
  id,
  image,
  translation,
  locale = "en",
  className = "",
}: any) => {
  return (
    <Link href={`/Statue/${id}`}>
      <Card
        className={`overflow-hidden hover:shadow-lg dark:bg-neutral-900 h-full transition-shadow ${className}`}
      >
        {image && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={image}
              alt={translation.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
        )}
        <CardContent className="p-4">
          <h3
            className={`text-xl font-semibold mb-2 ${
              locale === "bod" ? "font-monlamuchen" : ""
            }`}
          >
            {translation.name}
          </h3>
          <p
            className={`text-gray-600 dark:text-gray-300 line-clamp-3 ${
              locale === "bod" ? "font-monlamuchen" : ""
            }`}
          >
            {translation.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StatueCard;
