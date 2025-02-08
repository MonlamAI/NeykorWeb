'use client'
import dynamic from 'next/dynamic'

const MonasteryMap = dynamic(() => import('@/app/LocalComponents/MonasteryMap'), {
  ssr: false
})
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getgonpadetail, getgonpatype } from "@/app/actions/getactions";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Loading from "./Loading";
import Breadcrumb from "@/app/LocalComponents/Breadcrumb";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/app/Providers/ContextProvider";
import { toast } from "@/hooks/use-toast";
import { createS3UploadUrl } from "@/app/actions/postactions";
import { updategonpa } from "@/app/actions/updateaction";
import LoadingSkeleton from "../../Skeleton";
import { Input } from "@/components/ui/input";
import { Loader2, Pause, Pen, Volume2,  } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { validateFile } from '@/lib/utils';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3'];

export default function MonasteryPage({ params }: { params: any}) {
  return (
    <Suspense fallback={<Loading />}>
      <MonasteryContent params={params} />
    </Suspense>
  );
}

function MonasteryContent({ params }: { params: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedSect, setEditedSect] = useState("");
const [editedType, setEditedType] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedGeoLocation, setEditedGeoLocation] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newAudio, setNewAudio] = useState<File | null>(null);
  const [types, setTypes] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  
  const queryClient = useQueryClient();
  const { role } = useRole();
  const isAdmin = useMemo(() => role === "ADMIN", [role]);
  const activeLocale = params.locale;

  const {
    data: monastery,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["gonpa", params.slug],
    queryFn: () => getgonpadetail(params.slug),
  });

  const languageCode = useMemo(() => 
    ({ en: "en", bod: "bo" }[params.locale] || "en"), 
    [params.locale]
  );

  const currentTranslation = useMemo(() => {
    if (!monastery?.translations) return null;
    return monastery.translations.find(t => t.languageCode === languageCode);
  }, [monastery?.translations, languageCode]);

  const breadcrumbLabels= {
    en: {
      home: "Home",
      monastery: "Monastery",
      details: "Details",
    },
    bod: {
      home: "གཙོ་ངོས།",
      monastery: "དགོན་པ།",
      details: "ཞིབ་ཕྲ།",
    },
  };
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData = await getgonpatype();
        setTypes(typesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch monastery types",
          variant: "destructive",
        });
      }
    };
    fetchTypes();
  }, []);
  useEffect(() => {
    if (currentTranslation && monastery) {
      setEditedName(currentTranslation.name || "");
      setEditedDescription(currentTranslation.description || "");
      setEditedGeoLocation(monastery.geo_location || "");
      setEditedSect(monastery.sect || "");
      setEditedType(monastery.type || "");

    }
  }, [currentTranslation, monastery]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && isEditing) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [isEditing, editedDescription]);

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

  const handleCancel = () => {
    setIsEditing(false);
    setNewImage(null);
    setNewAudio(null);
    if (currentTranslation && monastery) {
      setEditedName(currentTranslation.name || "");
      setEditedDescription(currentTranslation.description || "");
      setEditedGeoLocation(monastery.geo_location || "");
    }
  };

  const handleSave = async () => {
    if (!monastery || !currentTranslation) return;

    try {
      setIsUpdating(true);

      let imageUrl = monastery.image;
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
        sect: editedSect,
        type: editedType,
        contactId: monastery.contact.id,
        translations: monastery.translations.map((t: any) => ({
          languageCode: t.languageCode,
          name: t.languageCode === languageCode ? editedName : t.name,
          description: t.languageCode === languageCode ? editedDescription : t.description,
          description_audio: t.languageCode === languageCode ? audioUrl : t.description_audio
        }))
      };

      await updategonpa(params.slug, updatedData);
      
      queryClient.setQueryData(["gonpa", params.slug], {
        ...monastery,
        image: imageUrl,
        geo_location: editedGeoLocation,
        sect: editedSect,
        type: editedType,
        translations: updatedData.translations
      });

      setIsEditing(false);
      setNewImage(null);
      setNewAudio(null);
      await refetch();

      toast({
        title: "Success",
        description: "Monastery updated successfully",
      });
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update monastery",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleAudio = (audioUrl: string) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(error => {
          console.error('Audio playback error:', error);
          toast({
            title: "Error",
            description: "Failed to play audio",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500 p-8">Failed to load monastery details</div>;
  if (!monastery || !currentTranslation) return <div className="p-8">No data found</div>;

  const labels = breadcrumbLabels[activeLocale] || breadcrumbLabels.en;
  const contactEn = monastery.contact.translations.find(t => t.languageCode === "en");

  const breadcrumbItems = [
    { label: labels.monastery, href: "/Monastary" },
    { label: currentTranslation.name || labels.details },
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
        locale={activeLocale}
        labels={{ home: labels.home }}
      />
      
      <div className="grid max-w-6xl p-4 mx-auto grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="relative">
              <Image
                src={monastery.image}
                alt={currentTranslation.name || "Monastery image"}
                width={1200}
                height={800}
                className="w-full h-64 object-cover rounded-t-lg"
                priority
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-md p-4 w-full max-w-sm mx-4">
                    <h3 className="text-sm font-medium mb-2">Update Image</h3>
                    <Input
                      type="file"
                      accept={SUPPORTED_IMAGE_TYPES.join(',')}
                      className="bg-white/40 text-white cursor-pointer"
                      onChange={(e) => handleFileChange(e, 'image')}
                    />
                    {newImage && (
                      <p className="text-sm mt-2">Selected: {newImage.name}</p>
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
                      className={activeLocale === "bod" ? "font-monlamuchen" : ""}
                    />
                  ) : (
                    <CardTitle className={`text-2xl font-bold ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                      {currentTranslation.name}
                    </CardTitle>
                  )}
                  
                  <div className="flex gap-2">
                 {
                  !isEditing && (
                    <>
                     <Badge variant="outline" className="capitalize">
                      {monastery.sect.toLowerCase()}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {monastery.type.toLowerCase()}
                    </Badge>
                    </>
                  )
                 }
                    {currentTranslation.description_audio && !isEditing && (
                      <button
                        onClick={() => toggleAudio(currentTranslation.description_audio!)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : < Volume2 className="w-6 h-6" />}
                      </button>
                    )}
                    
                    {isAdmin && !isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                        aria-label="Edit monastery"
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
                    <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="text-sm font-medium">Type</label>
      <Select 
        value={editedType}
        onValueChange={(value) => setEditedType(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {types.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Sect</label>
      <Select 
        value={editedSect}
        onValueChange={(value) => setEditedSect(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select sect" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NYINGMA">Nyingma</SelectItem>
          <SelectItem value="KAGYU">Kagyu</SelectItem>
          <SelectItem value="SAKYA">Sakya</SelectItem>
          <SelectItem value="GELUG">Gelug</SelectItem>
          <SelectItem value="BON">Bon</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
  
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
                    className={`min-h-[150px] overflow-hidden ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}
                  />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Update Audio Description (MP3, max 10MB)
                      </label>
                      <Input
                        type="file"
                        accept={SUPPORTED_AUDIO_TYPES.join(',')}
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
                <div className="space-y-2">
                  <h3 className={`text-xl font-semibold ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    {activeLocale === "bod" ? "བརྗོད་གཞི" : "Description"}
                  </h3>
                  <p className={`text-gray-700 dark:text-gray-400 text-justify leading-relaxed ${
                    activeLocale === "bod" ? "font-monlamuchen" : ""
                  }`}>
                    {currentTranslation.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {monastery.geo_location && (
            <MonasteryMap
              geoLocation={monastery.geo_location}
              monasteryName={currentTranslation.name}
              locale={activeLocale}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className={`text-xl ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                {activeLocale === "bod" ? "འབྲེལ་གཏུགས་ཀྱི་གནས་ཚུལ" : "Contact Information"}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-2">
              {contactEn?.address && (
                <div>
                  <p className={`font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    {activeLocale === "bod" ? "ཁ་བྱང་།" : "Address"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {contactEn.address}
                    <br />
                    {contactEn.city}
                    {contactEn.state && <>, {contactEn.state}</>}
                    {contactEn.postal_code && <> {contactEn.postal_code}</>}
                    <br />
                    {contactEn.country}
                  </p>
                </div>
              )}
              
              {monastery.contact.phone_number && (
                <div>
                  <p className={`font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    {activeLocale === "bod" ? "ཁ་པར་།" : "Phone"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {monastery.contact.phone_number}
                  </p>
                </div>
              )}
              
              {monastery.contact.email && (
                <div>
                  <p className={`font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    {activeLocale === "bod" ? "ཡིག་འཕྲིན།" : "Email"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {monastery.contact.email}
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