"use client";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Volume2, Pause } from "lucide-react";
import { getsitedetail } from "@/app/actions/getactions";
import MonasteryMap from "@/app/LocalComponents/MonasteryMap";
import LoadingSkeleton from "../../Statue/_Components/DetailSkeleton";
import { useQuery } from "@tanstack/react-query";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";

export default function PilgrimSitePage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PilgrimSiteContent params={params} />
    </Suspense>
  );
}

function PilgrimSiteContent({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    data: siteData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pilgrimsite", params.id],
    queryFn: () => getsitedetail(params.id),
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
      <div className="text-red-500 p-8">
        Failed to load pilgrim site details
      </div>
    );
  if (!siteData) return <div className="p-8">No data found</div>;

  const breadcrumbLabels = {
    en: {
      home: "Home",
      pilgrimage: "Pilgrimage Sites",
      details: "Details",
    },
    bod: {
      home: "གཙོ་ངོས།",
      pilgrimage: "གནས་ཡུལ།",
      details: "ཞིབ་ཕྲ།",
    },
  }[params.locale] || {
    home: "Home",
    pilgrimage: "Pilgrimage Sites",
    details: "Details",
  };

  const languageCode = params.locale === "bod" ? "bo" : "en";
  const currentTranslation = siteData.translations.find(
    (t: any) => t.languageCode === languageCode
  );

  const contactInfo = siteData.contact.translations.find(
    (t: any) => t.languageCode === "en"
  );
  const breadcrumbItems = [
    {
      label: breadcrumbLabels.details,
      href: "/Sacred",
    },
    {
      label: currentTranslation?.name || breadcrumbLabels.details,
    },
  ];
  return (
    <div className="container py-8">
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => setIsPlaying(false)}
      />

      <Breadcrumb
        items={breadcrumbItems}
        locale={params.locale}
        labels={{ home: breadcrumbLabels.home }}
      />

      <div className="grid grid-cols-1 max-w-6xl p-4 mx-auto lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Image
              src={siteData.image}
              alt={currentTranslation?.name || "Pilgrim site image"}
              className="w-full h-64 object-cover rounded-t-lg"
              width={1200}
              height={800}
              priority
            />

            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle
                    className={`text-2xl font-bold ${
                      params.locale === "bod" && "font-monlamuchen"
                    }`}
                  >
                    {currentTranslation?.name}
                  </CardTitle>
                  {currentTranslation?.description_audio &&
                    params.locale === "bod" && (
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3
                  className={`text-xl font-semibold ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {params.locale === "bod" ? "བརྗོད་གཞི" : "Description"}
                </h3>
                <p
                  className={`text-gray-700 dark:text-gray-400 text-justify leading-relaxed ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {currentTranslation?.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {siteData.geo_location && (
            <MonasteryMap
              geoLocation={siteData.geo_location}
              monasteryName={currentTranslation?.name || ""}
              locale={params.locale}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle
                className={`text-xl ${
                  params.locale === "bod" && "font-monlamuchen"
                }`}
              >
                {params.locale === "bod"
                  ? "འབྲེལ་གཏུགས་ཀྱི་གནས་ཚུལ"
                  : "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contactInfo?.address && (
                <div>
                  <p
                    className={`font-medium ${
                      params.locale === "bod" && "font-monlamuchen"
                    }`}
                  >
                    {params.locale === "bod" ? "ཁ་བྱང་།" : "Address"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {contactInfo.address}
                    <br />
                    {contactInfo.city}
                    {contactInfo.state && <>, {contactInfo.state}</>}
                    {contactInfo.postal_code && <> {contactInfo.postal_code}</>}
                    <br />
                    {contactInfo.country}
                  </p>
                </div>
              )}
              {siteData.contact.phone_number && (
                <div>
                  <p
                    className={`font-medium ${
                      params.locale === "bod" && "font-monlamuchen"
                    }`}
                  >
                    {params.locale === "bod" ? "ཁ་པར་།" : "Phone"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {siteData.contact.phone_number}
                  </p>
                </div>
              )}
              {siteData.contact.email && (
                <div>
                  <p
                    className={`font-medium ${
                      params.locale === "bod" && "font-monlamuchen"
                    }`}
                  >
                    {params.locale === "bod" ? "ཡིག་འཕྲིན།" : "Email"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {siteData.contact.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
