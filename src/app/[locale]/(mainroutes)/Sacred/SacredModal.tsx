import React, { useState, useEffect } from "react";
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
import { createcontact, createS3UploadUrl, createSacred } from "@/app/actions/postactions";
import { toast } from "@/hooks/use-toast";
import { validateFile } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATES, COUNTRIES } from '@/lib/utils';

const SacredModal = ({onSuccess }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState({
    email: "",
    phone_number: "",
    translations: [
      {
        languageCode: "en",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      },
      {
        languageCode: "bo",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      }
    ],
  });
  const [formData, setFormData] = useState({
    image: null as File | null,
    geo_location: "",
    contactId: "",
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
 


  const handleAddContactTranslation = () => {
    setContactData(prev => ({
      ...prev,
      translations: [
        ...prev.translations,
        {
          languageCode: "",
          address: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
        },
      ],
    }));
  };
  const handleRemoveContactTranslation = (index: number) => {
    if (index < 2) {
      toast({
        title: "Cannot remove",
        description: "English and Tibetan translations are required",
        variant: "destructive",
      });
      return;
    }
    setContactData(prev => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
  };
  const handleContactTranslationChange = (index: number, field: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      translations: prev.translations.map((trans, i) => {
        if (i === index) {
          // For non-English translations, state and country should mirror English translation
          if (index !== 0 && (field === 'state' || field === 'country')) {
            return trans;
          }
          return { ...trans, [field]: value };
        }
        // Update state and country for all non-English translations when English is updated
        if (index === 0 && (field === 'state' || field === 'country')) {
          return i === 0 ? { ...trans, [field]: value } : { ...trans, [field]: value };
        }
        return trans;
      }),
    }));
  };


 
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
        const contactResult = await createcontact(contactData);
        if (!contactResult.success) {
          throw new Error("Failed to create contact");
        }  
        const contactId = contactResult.data;
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
        geo_location: formData.geo_location,
        contactId: contactId,
        translations: translationsWithAudioUrls,
      };
      const result = await createSacred(preparedData);
  
      if (result) {
        toast({
          title: "Success",
          description: "Sacred Site added successfully",
        });
  
        setOpen(false);
        onSuccess(result.data);
        setFormData({
          image: null,
          geo_location: "",
          contactId: "",
          translations: [
            {
              languageCode: "en",
              name: "",
              description: "",
              description_audio: "",
              audioFile: null,
            },
            {
              languageCode: "bo",
              name: "",
              description: "",
              description_audio: "",
              audioFile: null,
            }
          ],
        });
        setContactData({
            email: "",
            phone_number: "",
            translations: [
              {
                languageCode: "en",
                address: "",
                city: "",
                state: "",
                postal_code: "",
                country: "",
              },
              {
                languageCode: "bo",
                address: "",
                city: "",
                state: "",
                postal_code: "",
                country: "",
              }
            ],
          })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add Sacred Site",
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
          <Plus size={16} /> Add Sacred Site
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Sacred Site</DialogTitle>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Geo Location</label>
            <Input
              required
              value={formData.geo_location}
              onChange={(e) => setFormData(prev => ({ ...prev, geo_location: e.target.value }))}
              placeholder="Enter geo location"
            />
          </div>

          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  required
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  required
                  value={contactData.phone_number}
                  onChange={(e) => setContactData(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Contact Translations</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddContactTranslation}
                >
                  <Plus size={16} className="mr-2" /> Add Translation
                </Button>
              </div>

              {contactData.translations.map((translation, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Contact Translation {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveContactTranslation(index)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language Code</label>
                      <Input
                        required
                        value={translation.languageCode}
                        onChange={(e) => handleContactTranslationChange(index, "languageCode", e.target.value)}
                        placeholder="e.g. bo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input
                        required
                        value={translation.address}
                        onChange={(e) => handleContactTranslationChange(index, "address", e.target.value)}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input
                        required
                        value={translation.city}
                        onChange={(e) => handleContactTranslationChange(index, "city", e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Select 
                        value={translation.state}
                        onValueChange={(value) => handleContactTranslationChange(index, "state", value)}
                        disabled={index !== 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Postal Code</label>
                      <Input
                        required
                        value={translation.postal_code}
                        onChange={(e) => handleContactTranslationChange(index, "postal_code", e.target.value)}
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Select
                        value={translation.country}
                        onValueChange={(value) => handleContactTranslationChange(index, "country", value)}
                        disabled={index !== 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Sacred Site Description (English & Tibetan required)</h3>
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
                    <label className="text-sm font-medium">Language Code</label>
                    <Input
                      required
                      value={translation.languageCode}
                      onChange={(e) =>
                        handleTranslationChange(index, "languageCode", e.target.value)
                      }
                      placeholder="e.g. bo"
                      disabled={index < 2}
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
                      placeholder="Sacred Site name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    required
                    value={translation.description}
                    onChange={(e) =>
                      handleTranslationChange(index, "description", e.target.value)
                    }
                    placeholder="Sacred Site description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Audio Description (MP3, max 10MB)</label>
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
                Adding Sacred Site...
              </>
            ) : (
              "Add Sacred Site"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SacredModal;