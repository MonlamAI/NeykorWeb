import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteSacred } from "@/app/actions/delaction";
import { Loader, TrashIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StatueCard = ({
  id,
  image,
  translation,
  locale,
  className = "",
  onDelete,
  isAdmin,
}: any) => {
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
 

  const handleDelete = async (e: React.MouseEvent) => {
     e.preventDefault();
     try {
       const confirm = window.confirm("Are you sure you want to delete this Statue?");
       if (!confirm) return;
       
       setIsDeleting(true);
       await deleteSacred(id);
       
       if (onDelete) {
         onDelete(id);
       }
       
       toast({
         title: "Success",
         description: "Statue has been deleted successfully",
         variant: "default",
       });
     } catch (error) {
       console.error("Failed to delete Statue:", error);
       toast({
         title: "Error",
         description: "Failed to delete Statue. Please try again.",
         variant: "destructive",
       });
     } finally {
       setIsDeleting(false);
     }
   };
 
  return (
    <Link href={`/${locale}/Statue/${id}`}>
      <Card
        className={`relative overflow-hidden hover:shadow-lg dark:bg-neutral-900 h-full transition-shadow ${className}`}
      >
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
        {image && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={image}
              alt={translation.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
        )}
        <CardContent className="p-4">
          <h3
            className={`text-xl font-semibold mb-2 ${
              locale === "bod" ? "font-monlamuchen" : ""
            }`}
          >
            {translation.name}
          </h3>
          <p
            className={`text-gray-600 dark:text-gray-300 line-clamp-3 ${
              locale === "bod" ? "font-monlamuchen" : ""
            }`}
          >
            {translation.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StatueCard;