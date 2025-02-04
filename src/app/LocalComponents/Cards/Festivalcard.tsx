import Link from "next/link";

const VALID_S3_PREFIX = "https://gompa-tour.s3.ap-south-1.amazonaws.com";

const isValidImageUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith(VALID_S3_PREFIX);
};

const FestivalCard = ({ id, image, translation, locale }: any) => {
  return (
    <Link
      href={`/Festival/${id}`}
      className="bg-white dark:bg-neutral-900 rounded-lg h-full shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div
        className={`w-full h-48 ${
          !isValidImageUrl(image)
            ? "bg-gradient-to-br from-gray-700 to-gray-900"
            : ""
        }`}
      >
        {isValidImageUrl(image) ? (
          <img
            src={image}
            alt={translation.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
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
