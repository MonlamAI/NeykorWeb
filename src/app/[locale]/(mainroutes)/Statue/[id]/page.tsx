"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Pause, ChevronRight, Home } from "lucide-react";
import { getStatuesdetail } from "@/app/actions/getactions";
import LoadingSkeleton from "../_Components/DetailSkeleton";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export default function StatuePage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeLocale = useLocale();

  const { data, isLoading, error } = useQuery({
    queryKey: ["statue", params.id],
    queryFn: () => getStatuesdetail(params.id),
  });

  const toggleAudio = (audioUrl: string) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);

    audio?.addEventListener("ended", handleEnded);
    return () => audio?.removeEventListener("ended", handleEnded);
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (error)
    return (
      <div className="text-red-500 p-8">Failed to load statue details</div>
    );
  if (!data) return <div className="p-8">No data found</div>;

  const breadcrumbLabels = {
    en: {
      home: "Home",
      statues: "Statues",
      details: "Details",
    },
    bod: {
      home: "གཙོ་ངོས།",
      statues: "རྟེན་བཤད།",
      details: "ཞིབ་ཕྲ།",
    },
  }[activeLocale] || {
    home: "Home",
    statues: "Statues",
    details: "Details",
  };

  const languageCode =
    {
      en: "en",
      bod: "bo",
    }[activeLocale] || "en";

  const currentTranslation = data.translations.find(
    (t: any) => t.languageCode === languageCode
  );

  const englishTranslation = data.translations.find(
    (t: any) => t.languageCode === "en"
  );

  return (
    <div className="relative">
      <div className="sticky top-0 bg-white dark:bg-neutral-950 z-10 border-b">
        <div className="max-w-6xl mx-auto p-4">
          <nav className="flex items-center  space-x-2 text-sm text-gray-600 dark:text-gray-200">
            <Link
              href="/"
              className="flex items-center hover:text-gray-900 dark:hover:text-gray-400  "
            >
              <Home className="w-4 h-4 mr-2" />
              <span
                className={activeLocale === "bod" ? "font-monlamuchen" : ""}
              >
                {breadcrumbLabels.home}
              </span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/Statue"
              className="hover:text-gray-900 dark:hover:text-gray-400  flex items-center "
            >
              <span
                className={activeLocale === "bod" ? "font-monlamuchen" : ""}
              >
                {breadcrumbLabels.statues}
              </span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span
              className={`text-gray-900 dark:text-gray-400 ${
                activeLocale === "bod" ? "font-monlamuchen" : ""
              }`}
            >
              {currentTranslation?.name || breadcrumbLabels.details}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <audio
          ref={audioRef}
          className="hidden"
          onEnded={() => setIsPlaying(false)}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={data.image}
                alt={currentTranslation?.name || "Statue"}
                fill
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                  `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#e2e8f0"/>
                  </svg>`
                ).toString("base64")}`}
              />
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h1
                    className={`text-2xl font-bold ${
                      activeLocale === "bod" && "font-monlamuchen"
                    }`}
                  >
                    {currentTranslation?.name}
                  </h1>
                  {currentTranslation?.description_audio &&
                    activeLocale === "bod" && (
                      <button
                        onClick={() =>
                          toggleAudio(currentTranslation.description_audio)
                        }
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Volume2 className="w-6 h-6" />
                        )}
                      </button>
                    )}
                </div>
                <p
                  className={`text-gray-700 dark:text-neutral-400 text-justify leading-relaxed ${
                    activeLocale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {currentTranslation?.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
