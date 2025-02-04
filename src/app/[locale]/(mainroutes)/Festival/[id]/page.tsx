"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Pause, ChevronRight, Home } from "lucide-react";
import { getfestivaldetail } from "@/app/actions/getactions";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import LoadingSkeleton from "../../Statue/_Components/DetailSkeleton";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";

interface Translation {
  id: string;
  festivalId: string;
  languageCode: string;
  name: string;
  description: string;
  description_audio: string;
}

interface FestivalData {
  id: string;
  start_date: string;
  end_date: string;
  image: string;
  translations: Translation[];
  createdAt: string;
  updatedAt: string;
}

export default function FestivalPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeLocale = useLocale();

  const { data, isLoading, error } = useQuery<FestivalData>({
    queryKey: ["festival", params.id],
    queryFn: () => getfestivaldetail(params.id),
  });

  const toggleAudio = (audioUrl: string) => {
    if (!audioUrl) return;

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
      <div className="text-red-500 p-8">Failed to load festival details</div>
    );
  if (!data) return <div className="p-8">No data found</div>;

  const breadcrumbLabels = {
    en: {
      home: "Home",
      festivals: "Festivals",
      details: "Details",
    },
    bod: {
      home: "གཙོ་ངོས།",
      festivals: "དུས་ཆེན།",
      details: "ཞིབ་ཕྲ།",
    },
  }[activeLocale] || {
    home: "Home",
    festivals: "Festivals",
    details: "Details",
  };

  const languageCode =
    {
      en: "en",
      bod: "bo",
    }[activeLocale] || "en";

  const currentTranslation = data.translations.find(
    (t) => t.languageCode === languageCode
  );
  const breadcrumbItems = [
    {
      label: breadcrumbLabels.festivals,
      href: "/Festival",
    },
    {
      label: currentTranslation?.name || breadcrumbLabels.details,
    },
  ];
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="relative">
      <Breadcrumb
        items={breadcrumbItems}
        locale={activeLocale}
        labels={{ home: breadcrumbLabels.home }}
      />

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
                alt={currentTranslation?.name || "Festival"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className={activeLocale === "bod" ? "font-monlamuchen" : ""}>
                  {activeLocale === "bod"
                    ? "འགོ་འཛུགས་ཚེས་གྲངས།"
                    : "Start Date"}
                  : {formatDate(data.start_date)}
                </p>
                <p className={activeLocale === "bod" ? "font-monlamuchen" : ""}>
                  {activeLocale === "bod" ? "མཇུག་རྫོགས་ཚེས་གྲངས།" : "End Date"}
                  : {formatDate(data.end_date)}
                </p>
              </div>
            </CardContent>
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
                        className="p-2 rounded-full hover:bg-gray-100"
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
                  className={`text-gray-700 dark:text-gray-400 text-justify leading-relaxed ${
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
