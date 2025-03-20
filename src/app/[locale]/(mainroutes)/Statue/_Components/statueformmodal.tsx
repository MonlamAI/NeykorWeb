import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Loader2 } from "lucide-react";
import { createS3UploadUrl, postStatue } from "@/app/actions/postactions";
import { toast } from "@/hooks/use-toast";
import { validateFile } from "@/lib/utils";

const StatueFormModal = ({ onSuccess }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    image: null as File | null,
    translations: [
      {
        languageCode: "en",
        name: "",
        description: "",
        description_audio: "",
        audioFile: null as File | null,
      },
      {
        languageCode: "bo",
        name: "",
        description: "",
        description_audio: "",
        audioFile: null as File | null,
      }
    ],
  });

  const handleAddTranslation = () => {
    setFormData((prev) => ({
      ...prev,
      translations: [
        ...prev.translations,
        {
          languageCode: "",
          name: "",
          description: "",
          description_audio: "",
          audioFile: null,
        },
      ],
    }));
  };

  const handleRemoveTranslation = (index: number) => {
    // Prevent removing the first two default translations (en and bo)
    if (index < 2) {
      toast({
        title: "Cannot remove",
        description: "English and Tibetan translations are required",
        variant: "destructive",
      });
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
  };

  const handleTranslationChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((trans, i) =>
        i === index ? { ...trans, [field]: value } : trans
      ),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file, type);

      if (type === 'image') {
        setFormData((prev) => ({ ...prev, image: file }));
      } else if (type === 'audio' && typeof index === 'number') {
        setFormData((prev) => ({
          ...prev,
          translations: prev.translations.map((trans, i) =>
            i === index ? { ...trans, audioFile: file } : trans
          ),
        }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const enTranslation = formData.translations.find(t => t.languageCode === "en");
    const boTranslation = formData.translations.find(t => t.languageCode === "bo");
    
    if (!enTranslation?.name || !enTranslation?.description) {
      toast({
        title: "Missing information",
        description: "English translation must be filled completely",
        variant: "destructive",
      });
      return;
    }
    
    if (!boTranslation?.name || !boTranslation?.description) {
      toast({
        title: "Missing information",
        description: "Tibetan translation must be filled completely",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = "";
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('file', formData.image);
        imageUrl = await createS3UploadUrl(imageFormData);
      }
      const translationsWithAudioUrls = await Promise.all(
        formData.translations.map(async (translation) => {
          let audioUrl = translation.description_audio;
          
          if (translation.audioFile) {
            const audioFormData = new FormData();
            audioFormData.append('file', translation.audioFile);
            audioUrl = await createS3UploadUrl(audioFormData);
          }

          return {
            languageCode: translation.languageCode,
            name: translation.name,
            description: translation.description,
            description_audio: audioUrl,
          };
        })
      );
  
      const preparedData = {
        image: imageUrl,
        translations: translationsWithAudioUrls,
      };
  
      const result = await postStatue(preparedData);
  
      if (result) {
        toast({
          title: "Success",
          description: "Statue added successfully",
        });
  
        setOpen(false);
        onSuccess(result.data);
        setFormData({
          image: null,
          translations: [
            {
              languageCode: "en",
              name: "",
              description: "",
              description_audio: "",
              audioFile: null as File | null,
            },
            {
              languageCode: "bo",
              name: "",
              description: "",
              description_audio: "",
              audioFile: null as File | null,
            }
          ],
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add statue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus size={16} /> Add Statue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Statue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Upload (JPEG, PNG, WebP, max 10MB)</label>
            <Input
              required
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(e, 'image')}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Statue Description (English & Tibetan required)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTranslation}
              >
                <Plus size={16} className="mr-2" /> Add Translation
              </Button>
            </div>

            {formData.translations.map((translation, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    {index === 0 ? "English Translation" : 
                     index === 1 ? "Tibetan Translation" : 
                     `Translation ${index + 1}`}
                  </h4>
                  {index > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTranslation(index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Language Code
                    </label>
                    <Input
                      required
                      value={translation.languageCode}
                      onChange={(e) =>
                        handleTranslationChange(
                          index,
                          "languageCode",
                          e.target.value
                        )
                      }
                      placeholder="e.g. bo"
                      disabled={index < 2} // Disable editing for default languages
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      required
                      value={translation.name}
                      onChange={(e) =>
                        handleTranslationChange(index, "name", e.target.value)
                      }
                      placeholder="Statue name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    required
                    value={translation.description}
                    onChange={(e) =>
                      handleTranslationChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Statue description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Audio Description (MP3, max 10MB)
                  </label>
                  <Input
                    type="file"
                    accept="audio/mpeg,audio/mp3"
                    onChange={(e) => handleFileChange(e, 'audio', index)}
                  />
                  {translation.audioFile && (
                    <p className="text-sm text-gray-500">
                      Selected file: {translation.audioFile.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Statue...
              </>
            ) : (
              "Add Statue"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StatueFormModal;