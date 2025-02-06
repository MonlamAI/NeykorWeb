import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deletepilgrim } from "@/app/actions/delaction";

const PilgrimSiteCard = ({ 
  id, 
  image, 
  translation, 
  locale,
  isadmin ,
  ondelelte
}: any) => {
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const confirm = window.confirm("Are you sure you want to delete this pilgrim site?");
      if (!confirm) return;

      await deletepilgrim(id);
      
      if (ondelelte) {
        ondelelte(id);
      }

      toast({
        title: "Success",
        description: "Pilgrim site has been deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete pilgrim site:", error);
      toast({
        title: "Error",
        description: "Failed to delete pilgrim site. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Link
      href={`/Sacred/${id}`}
      className="bg-white dark:bg-neutral-900 rounded-lg h-full shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
    >
      {isadmin && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-md shadow-lg"
          onClick={handleDelete}
        >
          <TrashIcon />
        </Button>
      )}
      {image && (
        <img
          src={image}
          alt={translation.name}
          className="w-full h-48 object-cover"
        />
      )}
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
          } text-gray-600 dark:text-gray-400 line-clamp-3`}
        >
          {translation.description}
        </p>
      </div>
    </Link>
  );
};

export default PilgrimSiteCard;