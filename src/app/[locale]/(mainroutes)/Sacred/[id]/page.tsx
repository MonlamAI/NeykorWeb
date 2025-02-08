"use client";
import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Volume2, Pause, Pen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getsitedetail } from "@/app/actions/getactions";
import { updatesite } from "@/app/actions/updateaction";
import { createS3UploadUrl } from "@/app/actions/postactions";
import MonasteryMap from "@/app/LocalComponents/MonasteryMap";
import LoadingSkeleton from "../../Statue/_Components/DetailSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";
import { useRole } from "@/app/Providers/ContextProvider";
import { toast } from "@/hooks/use-toast";
import { validateFile } from "@/lib/utils";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedGeoLocation, setEditedGeoLocation] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newAudio, setNewAudio] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { role } = useRole();

  const isAdmin = useMemo(() => role === "ADMIN", [role]);

  const {
    data: siteData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["pilgrimsite", params.id],
    queryFn: () => getsitedetail(params.id),
  });

  const languageCode = params.locale === "bod" ? "bo" : "en";
  const currentTranslation = useMemo(() => {
    if (!siteData?.translations) return null;
    return siteData.translations.find(
      (t: any) => t.languageCode === languageCode
    );
  }, [siteData?.translations, languageCode]);

  useEffect(() => {
    if (currentTranslation && siteData) {
      setEditedName(currentTranslation.name || "");
      setEditedDescription(currentTranslation.description || "");
      setEditedGeoLocation(siteData.geo_location || "");
    }
  }, [currentTranslation, siteData]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && isEditing) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [isEditing, editedDescription]);

 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file, type);
      if (type === 'image') {
        setNewImage(file);
      } else {
        setNewAudio(file);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!siteData || !currentTranslation) return;
    
    try {
      setIsUpdating(true);
      
      let imageUrl = siteData.image;
      if (newImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', newImage);
        imageUrl = await createS3UploadUrl(imageFormData);
      }
  
      let audioUrl = currentTranslation.description_audio;
      if (newAudio) {
        const audioFormData = new FormData();
        audioFormData.append('file', newAudio);
        audioUrl = await createS3UploadUrl(audioFormData);
      }
  
      const updatedData = {
        image: imageUrl,
        geo_location: editedGeoLocation,
        contactId: siteData.contact.id,
        translations: siteData.translations.map((t: any) => ({
          languageCode: t.languageCode,
          name: t.languageCode === languageCode ? editedName : t.name,
          description: t.languageCode === languageCode ? editedDescription : t.description,
          description_audio: t.languageCode === languageCode ? audioUrl : t.description_audio
        }))
      };
  
      console.log('Sending update data:', updatedData);
  
      await updatesite(params.id, updatedData);
      setIsEditing(false);
      setNewImage(null);
      setNewAudio(null);
      queryClient.setQueryData(["pilgrimsite", params.id], {
        ...siteData,
        image: imageUrl,
        geo_location: editedGeoLocation,
        translations: updatedData.translations
      });
      refetch();
      
      toast({
        title: "Success",
        description: "Pilgrim site updated successfully",
      });
    } catch (error: any) {
      console.error('Update error:', error.response?.data || error);
      toast({
        title: "Error",
        description: error.message || "Failed to update pilgrim site",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewImage(null);
    setNewAudio(null);
    if (currentTranslation && siteData) {
      setEditedName(currentTranslation.name || "");
      setEditedDescription(currentTranslation.description || "");
      setEditedGeoLocation(siteData.geo_location || "");
    }
  };

  const toggleAudio = (audioUrl: string) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
  if (!siteData || !currentTranslation) return <div className="p-8">No data found</div>;

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

  const contactInfo = siteData.contact.translations.find(
    (t: any) => t.languageCode === "en"
  );
  
  const breadcrumbItems = [
    {
      label: breadcrumbLabels.pilgrimage,
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
            <div className="relative">
              <Image
                src={siteData.image}
                alt={currentTranslation?.name || "Pilgrim site image"}
                className="w-full h-64 object-cover rounded-t-lg"
                width={1200}
                height={800}
                priority
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-md p-4 w-full max-w-sm mx-4">
                    <h3 className="text-sm font-medium mb-2">Update Image</h3>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="bg-white/40 text-white cursor-pointer"
                      onChange={(e) => handleFileChange(e, 'image')}
                    />
                    {newImage && (
                      <p className="text-sm mt-2">
                        Selected: {newImage.name}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className={params.locale === "bod" ? "font-monlamuchen" : ""}
                    />
                  ) : (
                    <CardTitle
                      className={`text-2xl font-bold ${
                        params.locale === "bod" && "font-monlamuchen"
                      }`}
                    >
                      {currentTranslation?.name}
                    </CardTitle>
                  )}
                  <div className="flex gap-2">
                    {currentTranslation?.description_audio && !isEditing &&
                      (
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
                    {isAdmin && !isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                        aria-label="Edit pilgrim site"
                      >
                        <Pen className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Geo Location</label>
                    <Input
                      value={editedGeoLocation}
                      onChange={(e) => setEditedGeoLocation(e.target.value)}
                      placeholder="Enter geo location"
                      className="mb-4"
                    />
                  </div>
                  <Textarea
                    ref={textareaRef}
                    value={editedDescription}
                    onChange={(e) => {
                      setEditedDescription(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    className={`min-h-[150px] overflow-hidden ${
                      params.locale === "bod" && "font-monlamuchen"
                    }`}
                  />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Update Audio Description (MP3, max 10MB)
                      </label>
                      <Input
                        type="file"
                        accept="audio/mpeg,audio/mp3"
                        onChange={(e) => handleFileChange(e, 'audio')}
                      />
                      {newAudio && (
                        <p className="text-sm text-gray-500">
                          Selected: {newAudio.name}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isUpdating}>
                        {isUpdating ? (<>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
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