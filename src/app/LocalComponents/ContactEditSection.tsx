'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pen, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updatecontact } from '@/app/actions/updateaction';
import DynamicQRCode from './generators/Qrcode';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { STATES, COUNTRIES } from '@/lib/utils';

const ContactEditSection = ({ 
  contact, 
  activeLocale, 
  isAdmin, 
  onUpdate,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedContact, setEditedContact] = useState({
    email: contact.email || "",
    phone_number: contact.phone_number || "",
    translations: contact.translations.map((t: any) => ({
      languageCode: t.languageCode,
      address: t.address || "",
      city: t.city || "",
      state: t.state || "",
      postal_code: t.postal_code || "",
      country: t.country || ""
    }))
  });

  const contactEn = contact.translations.find((t: any) => t.languageCode === "en");

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContact({
      email: contact.email || "",
      phone_number: contact.phone_number || "",
      translations: contact.translations.map((t: any) => ({
        languageCode: t.languageCode,
        address: t.address || "",
        city: t.city || "",
        state: t.state || "",
        postal_code: t.postal_code || "",
        country: t.country || ""
      }))
    });
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      
      const updateData = {
        email: editedContact.email,
        phone_number: editedContact.phone_number,
        translations: editedContact.translations.map((t: {
          languageCode: string;
          address: string;
          city: string;
          state: string;
          postal_code: string;
          country: string;
        }) => ({
          languageCode: t.languageCode,
          address: t.address,
          city: t.city,
          state: t.state,
          postal_code: t.postal_code,
          country: t.country
        }))
      };
      
      const result = await updatecontact(contact.id, updateData);
      
      if (result.success) {
        onUpdate(result.data);
        setIsEditing(false);
        
        toast({
          title: "Success",
          description: "Contact information updated successfully",
        });
      } else {
        throw new Error("Failed to update contact");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact information",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateTranslation = (languageCode: string, field: string, value: string) => {
    setEditedContact(prev => ({
      ...prev,
      translations: prev.translations.map((t: {
        languageCode: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
      }) => 
        t.languageCode === languageCode 
          ? { ...t, [field]: value }
          : t
      )
    }));
  };

  return (
    <Card>
       <DynamicQRCode/>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={`text-xl ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
          {activeLocale === "bod" ? "འབྲེལ་གཏུག་གནས་ཚུལ།" : "Contact Information"}
        </CardTitle>
        {isAdmin && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pen className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                {activeLocale === "bod" ? "ཡིག་འཕྲིན།" : "Email"}
              </label>
              <Input
                value={editedContact.email}
                onChange={(e) => setEditedContact(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
              />
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                {activeLocale === "bod" ? "ཁ་པར།" : "Phone Number"}
              </label>
              <Input
                value={editedContact.phone_number}
                onChange={(e) => setEditedContact(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                {activeLocale === "bod" ? "ཁ་བྱང་།" : "Address"}
              </label>
              <Input
                value={editedContact.translations[0].address}
                onChange={(e) => updateTranslation("en", "address", e.target.value)}
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "གྲོང་ཁྱེར།" : "City"}
                </label>
                <Input
                  value={editedContact.translations[0].city}
                  onChange={(e) => updateTranslation("en", "city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "མངའ་སྡེ།" : "State"}
                </label>
                <Select 
                  value={editedContact.translations[0].state}
                  onValueChange={(value) => updateTranslation("en", "state", value)}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "འཕྲིན་ཡིག་ཨང་།" : "Postal Code"}
                </label>
                <Input
                  value={editedContact.translations[0].postal_code}
                  onChange={(e) => updateTranslation("en", "postal_code", e.target.value)}
                  placeholder="Enter postal code"
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "རྒྱལ་ཁབ།" : "Country"}
                </label>
                <Select 
                  value={editedContact.translations[0].country}
                  onValueChange={(value) => updateTranslation("en", "country", value)}
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
        ) : (
          <>
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

            {contact.phone_number && (
              <div>
                <p className={`font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "ཁ་པར་།" : "Phone"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {contact.phone_number}
                </p>
              </div>
            )}

            {contact.email && (
              <div>
                <p className={`font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "ཡིག་འཕྲིན།" : "Email"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {contact.email}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactEditSection;