import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { deletegonpa } from "@/app/actions/delaction";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader, TrashIcon } from "lucide-react";

const MonasteryCard = ({
  id,
  sect,
  image,
  translation,
  contactTranslation,
  type,
  locale = "en",
  className = "",
  onDelete,
  isAdmin,
}: any) => {
  const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
  
   const handleDelete = async (e: React.MouseEvent) => {
       e.preventDefault();
       try {
         const confirm = window.confirm("Are you sure you want to delete this Gonpa?");
         if (!confirm) return;
         
         setIsDeleting(true);
         await deletegonpa(id);
         
         if (onDelete) {
           onDelete(id);
         }
         
         toast({
           title: "Success",
           description: "Gonpa has been deleted successfully",
           variant: "default",
         });
       } catch (error) {
         console.error("Failed to delete Gonpa:", error);
         toast({
           title: "Error",
           description: "Failed to delete Gonpa. Please try again.",
           variant: "destructive",
         });
       } finally {
         setIsDeleting(false);
       }
     };
  
  return (
    <Link href={`/${locale}/Monastary/${sect}/${id}`}>
      <Card
        className={`overflow-hidden hover:shadow-lg dark:bg-neutral-900 h-full transition-shadow ${className} `}
      >
         
        <div className="relative w-full h-48">
        {isAdmin && (
          <Button
            variant="destructive"
            size="icon"
            disabled={isDeleting}
            className="absolute top-2 right-2 z-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-md shadow-lg"
            onClick={handleDelete}
          >
            {isDeleting ? <span className="animate-spin"> <Loader /></span> : <TrashIcon />}
            </Button>
        )}
          {image &&
           (
            image.startsWith("https://gompa-tour.s3.ap-south-1.amazonaws.com") ||
            image.startsWith("https://monlam-ai-web-testing.s3.ap-south-1.amazonaws.com")
          ) 
          ? (
            <Image
              src={image}
              alt={translation.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-gray-300">
              <span className="text-lg">No Image Available</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3
              className={`text-lg font-semibold dark:text-neutral-300 text-neutral-800 ${
                locale === "bod" ? "font-monlamuchen" : ""
              }`}
            >
              {translation.name}
            </h3>
            <Badge variant="secondary">{type}</Badge>
          </div>
          <p
            className={`text-gray-600 dark:text-neutral-400 line-clamp-3 ${
              locale === "bod" ? "font-monlamuchen" : ""
            }`}
          >
            {translation.description}
          </p>
          {contactTranslation && (
            <div className="mt-2 text-sm text-gray-500">
              <p>
                {contactTranslation.address}, {contactTranslation.city}
              </p>
              <p>
                {contactTranslation.state}, {contactTranslation.postal_code}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default MonasteryCard;
