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
import { STATES, COUNTRIES, localeAlias } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const ContactEditSection = ({ 
  contact, 
  activeLocale, 
  isAdmin, 
  onUpdate,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedContact, setEditedContact] = useState(() => {
    const existingTranslations = contact.translations.map((t: any) => ({
      languageCode: t.languageCode,
      address: t.address || "",
      city: t.city || "",
      state: t.state || "",
      postal_code: t.postal_code || "",
      country: t.country || ""
    }));
    
    const hasCurrentLocaleTranslation = existingTranslations.some((t: any) => 
      t.languageCode === activeLocale || t.languageCode === localeAlias[activeLocale]
    );
    
    const translations = hasCurrentLocaleTranslation ? existingTranslations : [
      ...existingTranslations,
      {
        languageCode: localeAlias[activeLocale] || activeLocale,
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
      }
    ];
    
    return {
      email: contact.email || "",
      phone_number: contact.phone_number || "",
      translations
    };
  });
  
  const stateT = useTranslations("state");
  const countryT = useTranslations("country");

  const activeTranslation = contact.translations.find((t: any) => 
    t.languageCode === (localeAlias[activeLocale] || activeLocale)
  );

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
    setEditedContact(prev => {
      const translationExists = prev.translations.some((t: any) => 
        t.languageCode === (localeAlias[languageCode] || languageCode)
      );
      
      if (!translationExists) {
        return {
          ...prev,
          translations: [
            ...prev.translations,
            {
              languageCode: localeAlias[languageCode] || languageCode,
              address: field === 'address' ? value : "",
              city: field === 'city' ? value : "",
              state: field === 'state' ? value : "",
              postal_code: field === 'postal_code' ? value : "",
              country: field === 'country' ? value : ""
            }
          ]
        };
      }
      
      const updatedTranslations = prev.translations.map((t: any) => {
        if (t.languageCode === (localeAlias[languageCode] || languageCode)) {
          return {
            ...t,
            [field]: value
          };
        }
        return t;
      });

      if (field === 'state' || field === 'country') {
        return {
          ...prev,
          translations: prev.translations.map((t: any) => {
            if (t.languageCode === (localeAlias[languageCode] || languageCode)) {
              return {
                ...t,
                [field]: value
              };
            }
            return t;
          })
        };
      }

      return {
        ...prev,
        translations: updatedTranslations
      };
    });
  };

  const getTranslationForEditing = (languageCode: string) => {
    const normalizedLanguageCode = localeAlias[languageCode] || languageCode;
    const translation = editedContact.translations.find((t: any) => 
      t.languageCode === normalizedLanguageCode
    );
    
    if (translation) {
      return translation;
    }
    
    return {
      languageCode: normalizedLanguageCode,
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: ""
    };
  };

  const activeEditTranslation = getTranslationForEditing(activeLocale);

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
                value={activeEditTranslation.address}
                onChange={(e) => updateTranslation(activeLocale, "address", e.target.value)}
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "གྲོང་ཁྱེར།" : "City"}
                </label>
                <Input
                  value={activeEditTranslation.city}
                  onChange={(e) => updateTranslation(activeLocale, "city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "མངའ་སྡེ།" : "State"}
                </label>
                <Select 
                  value={activeEditTranslation.state}
                  onValueChange={(value) => updateTranslation(activeLocale, "state", value)}
                >
                  <SelectTrigger className={` ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    <SelectValue placeholder={activeLocale === "bod" ? "མངའ་སྡེ་འདེམས།" : "Select a state"} />
                  </SelectTrigger>
                  <SelectContent  className={` ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    {STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {activeLocale === "bod" ? stateT(state) : state}
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
                  value={activeEditTranslation.postal_code}
                  onChange={(e) => updateTranslation(activeLocale, "postal_code", e.target.value)}
                  placeholder="Enter postal code"
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                  {activeLocale === "bod" ? "རྒྱལ་ཁབ།" : "Country"}
                </label>
                <Select 
                  value={activeEditTranslation.country}
                  onValueChange={(value) => updateTranslation(activeLocale, "country", value)}
                >
                  <SelectTrigger className={` ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    <SelectValue placeholder={activeLocale === "bod" ? "རྒྱལ་ཁབ་འདེམས།" : "Select a country"} />
                  </SelectTrigger>
                  <SelectContent className={` ${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {activeLocale === "bod" ? countryT(country) : country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className={` ${activeLocale === "bod" ? "font-monlamuchen" : ""}`} onClick={handleCancel}>
                {activeLocale === "bod" ? "ཕྱིར་འཐོན།" : "Cancel"}
              </Button>
              <Button onClick={handleSave} className={` ${activeLocale === "bod" ? "font-monlamuchen" : ""}`} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {activeLocale === "bod" ? "ཉར་བཞིན་པ།" : "Saving..."}
                  </>
                ) : (
                  activeLocale === "bod" ? "ཉར།" : "Save"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {activeTranslation?.address && (
              <div className= {`${activeLocale === "bod" ? "font-monlamuchen" : ""}`}>
                <p className={`font-medium `}>
                  {activeLocale === "bod" ? "ཁ་བྱང་།" : "Address"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTranslation.address}
                  <br />
                  {activeTranslation.city}
                  {activeTranslation.state && (
                    <>
                      , {activeLocale === "bod" ? stateT(activeTranslation.state) : activeTranslation.state}
                    </>
                  )}
                  {activeTranslation.postal_code && <> {activeTranslation.postal_code}</>}
                  <br />
                  {activeTranslation.country && (activeLocale === "bod" ? countryT(activeTranslation.country) : activeTranslation.country)}
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