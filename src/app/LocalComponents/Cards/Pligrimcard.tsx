import Link from "next/link";

const PilgrimSiteCard = ({ id, image, translation, locale }: any) => {
  return (
    <Link
      href={`/Sacred/${id}`}
      className="bg-white dark:bg-neutral-900 rounded-lg  h-full shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
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
