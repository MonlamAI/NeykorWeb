"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Pause, ChevronRight, Home } from "lucide-react";
import { getStatuesdetail } from "@/app/actions/getactions";
import LoadingSkeleton from "../_Components/DetailSkeleton";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export default function StatuePage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activelocale = useLocale();

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

  const getTranslation = (languageCode: string) =>
    data.translations.find((t: any) => t.languageCode === languageCode);

  const englishTranslation = getTranslation("en");
  const tibetanTranslation = getTranslation("bo");

  return (
    <div className="relative">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="max-w-6xl mx-auto p-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-gray-900">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/Statue" className="hover:text-gray-900">
              Statues
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">
              {englishTranslation?.name || "Details"}
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
                alt={englishTranslation?.name || "Statue"}
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
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="bo" className="font-monlamuchen">
                  བོད་ཡིག
                </TabsTrigger>
              </TabsList>

              <TabsContent value="en">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h1 className="text-2xl font-bold">
                      {englishTranslation?.name}
                    </h1>
                    <p className="text-gray-700 text-justify leading-relaxed">
                      {englishTranslation?.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bo">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h1
                        className={`text-2xl font-bold ${
                          activelocale === "bod" && "font-monlamuchen"
                        }`}
                      >
                        {tibetanTranslation?.name}
                      </h1>
                      {tibetanTranslation?.description_audio && (
                        <button
                          onClick={() =>
                            toggleAudio(tibetanTranslation.description_audio)
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
                      className={`text-gray-700 leading-relaxed ${
                        activelocale === "bod" &&
                        "font-monlamuchen text-justify"
                      }`}
                    >
                      {tibetanTranslation?.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
