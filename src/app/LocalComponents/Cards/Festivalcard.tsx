import { deletefest } from "@/app/actions/delaction";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FestivalCard = ({ id, image, translation, locale, isadmin, onDelete }: any) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const confirm = window.confirm("Are you sure you want to delete this Festival?");
      if (!confirm) return;
      
      setIsDeleting(true);
      await deletefest(id);
      
      if (onDelete) {
        onDelete(id);
      }
      
      toast({
        title: "Success",
        description: "Festival has been deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete Festival:", error);
      toast({
        title: "Error",
        description: "Failed to delete Festival. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link
      href={`/${locale}/Festival/${id}`}
      className="bg-white dark:bg-neutral-900 rounded-lg h-full shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full h-48">
        {isadmin && (
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
        (image.startsWith("https://s3.ap-south-1.amazonaws.com") || image.startsWith("https://monlam-ai-web-testing.s3.ap-south-1.amazonaws.com") || image.startsWith("https://gompa.tour.s3.ap-south-1.amazonaws.com"))
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
      <div className="p-4">
        <h3
          className={`text-xl font-semibold mb-2 ${
            locale === "bod" && "font-monlamuchen"
          }`}
        >
          {translation.name}
        </h3>
        <p
          className={`${
            locale === "bod" && "font-monlamuchen"
          } text-gray-600 dark:text-gray-300 line-clamp-3`}
        >
          {translation.description}
        </p>
      </div>
    </Link>
  );
};

export default FestivalCard;