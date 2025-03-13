import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Loader2 } from "lucide-react";
import { createcontact, creategonpa, createS3UploadUrl, postStatue } from "@/app/actions/postactions";
import { toast } from "@/hooks/use-toast";
import { getGonpaTypes } from "@/app/actions/getactions";
import { validateFile } from "@/lib/utils";
import { STATES } from '@/lib/utils';

const MonasteryModal = ({ id, onSuccess }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
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
    ],
  });
  const [formData, setFormData] = useState({
    image: null as File | null,
    geo_location: "",
    sect: id.toUpperCase(),
    type: "MONASTERY",
    contactId: "",
    translations: [
      {
        languageCode: "en",
        name: "",
        description: "",
        description_audio: "",
        audioFile: null as File | null,
      },
    ],
  });
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      sect: id.toUpperCase()
    }));
  }, [id]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData = await getGonpaTypes();
        setTypes(typesData as string[]);
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
    setContactData(prev => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
  };
  const handleContactTranslationChange = (index: number, field: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      translations: prev.translations.map((trans, i) =>
        i === index ? { ...trans, [field]: value } : trans
      ),
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
        sect: formData.sect,
        type: formData.type,
        contactId: contactId,
        translations: translationsWithAudioUrls,
      };
  
      const result = await creategonpa(preparedData);
  
      if (result) {
        toast({
          title: "Success",
          description: "Monastery added successfully",
        });
  
        setOpen(false);
        onSuccess(result.data);
        setFormData({
          image: null,
          geo_location: "",
          sect: id.toUpperCase(),
          type: "MONASTERY",
          contactId: "",
          translations: [
            {
              languageCode: "en",
              name: "",
              description: "",
              description_audio: "",
              audioFile: null,
            },
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
            ],
          })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add monastery",
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
          <Plus size={16} /> Add Monastery
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Monastery</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select 
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
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
            <Input
              required
              value={formData.sect}
              disabled
            />
          </div>
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
                    <h4 className="font-medium">Translation {index + 1}</h4>
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
                      <Input
                        required
                        value={translation.country}
                        onChange={(e) => handleContactTranslationChange(index, "country", e.target.value)}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Translations</h3>
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
                  <h4 className="font-medium">Translation {index + 1}</h4>
                  {index > 0 && (
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
                      placeholder="Monastery name"
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
                    placeholder="Monastery description"
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
                Adding Monastery...
              </>
            ) : (
              "Add Monastery"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MonasteryModal;