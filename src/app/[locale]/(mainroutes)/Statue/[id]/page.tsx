"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Pen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getStatuesDetail } from "@/app/actions/getactions";
import LoadingSkeleton from "../_Components/DetailSkeleton";
import { useLocale } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";
import { useRole } from "@/app/Providers/ContextProvider";
import { updatestatue } from "@/app/actions/updateaction";
import { createS3UploadUrl } from "@/app/actions/postactions";
import { toast } from "@/hooks/use-toast";
import { validateFile } from "@/lib/utils";
import DynamicQRCode from "@/app/LocalComponents/generators/Qrcode";

export default function StatuePage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newAudio, setNewAudio] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeLocale = useLocale();
  const { role } = useRole();
  const queryClient = useQueryClient();
  
const isAdmin = role === "ADMIN";
  
  const languageCode = useMemo(() => 
    ({ en: "en", bod: "bo" }[activeLocale] || "en"), 
    [activeLocale]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["statue", params.id],
    queryFn: () => getStatuesDetail(params.id),
  });

  const currentTranslation = useMemo(() => {
    if (!data?.translations) return null;
    return data.translations.find((t: any) => t.languageCode === languageCode);
  }, [data?.translations, languageCode]);

  useEffect(() => {
    if (audioRef.current && currentTranslation?.description_audio) {
      audioRef.current.src = currentTranslation.description_audio;
      
      const handleLoadedMetadata = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      };
      
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [currentTranslation?.description_audio]);

  useEffect(() => {
    if (currentTranslation) {
      setEditedName(currentTranslation.name || "");
      setEditedDescription(currentTranslation.description || "");
    }
  }, [currentTranslation]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && isEditing) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [isEditing, editedDescription]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
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
    if (!data || !currentTranslation) return;
    
    try {
      setIsUpdating(true);
      let imageUrl = data.image;
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
        ...data,
        image: imageUrl,
        translations: data.translations.map((t: any) =>
          t.languageCode === languageCode
            ? {
                ...t,
                name: editedName,
                description: editedDescription,
                description_audio: audioUrl,
              }
            : t
        ),
      };

      await updatestatue(params.id, updatedData);
      setIsEditing(false);
      setNewImage(null);
      setNewAudio(null);
      queryClient.setQueryData(["statue", params.id], updatedData);
      refetch();
      
      toast({
        title: "Success",
        description: "Statue updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update statue",
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
    if (currentTranslation) {
      setEditedName(currentTranslation.name || "");
      setEditedDescription(currentTranslation.description || "");
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500 p-8">Failed to load statue details</div>;
  if (!data || !currentTranslation) return <div className="p-8">No data found</div>;

  const breadcrumbLabels = {
    en: { home: "Home", statues: "Statues", details: "Details" },
    bod: { home: "གཙོ་ངོས།", statues: "རྟེན་བཤད།", details: "ཞིབ་ཕྲ།" },
  }[activeLocale] || { home: "Home", statues: "Statues", details: "Details" };

  const fontClass = activeLocale === "bod" ? "font-monlamuchen" : "";

  return (
    <div className="relative w-full">
      <Breadcrumb
        items={[
          { label: breadcrumbLabels.statues, href: "/Statue" },
          { label: currentTranslation.name || breadcrumbLabels.details },
        ]}
        locale={activeLocale}
        labels={{ home: breadcrumbLabels.home }}
      />

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <audio ref={audioRef} className="hidden" />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={data.image}
                alt={currentTranslation.name || "Statue"}
                fill
                className="object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center">
                  <div className="g-white/20 backdrop-blur-sm border border-white/30 rounded-md p-4 w-full max-w-sm mx-4">
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
            <DynamicQRCode/>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className={fontClass}
                    />
                  ) : (
                    <h1 className={`text-2xl font-bold ${fontClass}`}>
                      {currentTranslation.name}
                    </h1>
                  )}
                  <div className="flex gap-2">
                    {currentTranslation.description_audio && !isEditing && (
                      <button
                        onClick={toggleAudio}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                    )}
                    {isAdmin && !isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                        aria-label="Edit statue"
                      >
                        <Pen className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      ref={textareaRef}
                      value={editedDescription}
                      onChange={(e) => {
                        setEditedDescription(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      className={`min-h-[150px] overflow-hidden ${fontClass}`}
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
                          {isUpdating ? (
                            <>
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
                  <p className={`text-gray-700 dark:text-neutral-400 text-justify leading-relaxed ${fontClass}`}>
                    {currentTranslation.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}