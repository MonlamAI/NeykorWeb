import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getgonpa } from "@/app/actions/getactions";
import { Suspense } from "react";
import Loading from "./Loading";
import MonasteryMap from "@/app/LocalComponents/MonasteryMap";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function MonasteryPage({
  params,
}: {
  params: { id: string; slug: string; locale: string };
}) {
  return (
    <Suspense fallback={<Loading />}>
      <MonasteryContent params={params} />
    </Suspense>
  );
}
async function MonasteryContent({
  params,
}: {
  params: { id: string; slug: string; locale: string };
}) {
  const gonpadata = await getgonpa();
  const monastery = gonpadata.find((m: any) => m.id === params.slug);
  const activeLocale = params.locale;

  if (!monastery) {
    return <div className="container py-12">Monastery not found</div>;
  }

  const breadcrumbLabels = {
    en: {
      home: "Home",
      monastery: "Monastery",
      details: "Details",
    },
    bod: {
      home: "གཙོ་ངོས།",
      monastery: "དགོན་པ།",
      details: "ཞིབ་ཕྲ།",
    },
  }[activeLocale] || {
    home: "Home",
    monastery: "Monastery",
    details: "Details",
  };

  const languageCode =
    {
      en: "en",
      bod: "bo",
    }[params.locale] || "en";

  const currentTranslation = monastery.translations.find(
    (t: any) => t.languageCode === languageCode
  );

  const contactEn = monastery.contact.translations.find(
    (t: any) => t.languageCode === "en"
  );

  return (
    <div className="container py-8">
      <div className="sticky top-0 bg-white dark:bg-neutral-950 z-10 mb-6">
        <div className=" mx-auto ">
          <nav className="flex items-center space-x-2 text-sm dark:text-gray-200 text-gray-600">
            <Link
              href={`/${activeLocale}`}
              className="flex items-center hover:text-gray-900 dark:hover:text-gray-300"
            >
              <Home className="w-4 h-4 mr-1" />
              <span
                className={activeLocale === "bod" ? "font-monlamuchen" : ""}
              >
                {breadcrumbLabels.home}
              </span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/Monastary"
              className="hover:text-gray-900 dark:hover:text-gray-300"
            >
              <span
                className={activeLocale === "bod" ? "font-monlamuchen" : ""}
              >
                {breadcrumbLabels.monastery}
              </span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/Monastary/${params.id}`}
              className="hover:text-gray-900 dark:hover:text-gray-300"
            >
              <span
                className={activeLocale === "bod" ? "font-monlamuchen" : ""}
              >
                {params.id}
              </span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span
              className={`text-gray-900 dark:text-gray-300 ${
                activeLocale === "bod" ? "font-monlamuchen" : ""
              }`}
            >
              {currentTranslation?.name || breadcrumbLabels.details}
            </span>
          </nav>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Image
              src={monastery.image}
              alt={currentTranslation?.name || "Monastery image"}
              width={1200}
              height={800}
              className="w-full h-64 object-cover rounded-t-lg"
              priority
            />
            <CardHeader>
              <div className="space-y-2">
                <CardTitle
                  className={`text-2xl font-bold ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {currentTranslation?.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize">
                    {monastery.sect.toLowerCase()}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {monastery.type.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3
                  className={`text-xl font-semibold ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {params.locale === "bod" ? "བརྗོད་གཞི" : "Description"}
                </h3>
                <p
                  className={`text-gray-600 dark:text-gray-400 whitespace-pre-line text-lg text-justify ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {currentTranslation?.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {monastery.geo_location && (
            <MonasteryMap
              geoLocation={monastery.geo_location}
              monasteryName={currentTranslation?.name || ""}
              locale={params.locale}
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle
                className={`text-xl ${
                  params.locale === "bod" && "font-monlamuchen"
                }`}
              >
                {params.locale === "bod"
                  ? "འབྲེལ་གཏུགས་ཀྱི་གནས་ཚུལ"
                  : "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p
                  className={`font-medium ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {params.locale === "bod" ? "ཁ་བྱང་།" : "Address"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {contactEn?.address}
                  <br />
                  {contactEn?.city}
                  <br />
                  {contactEn?.state} {contactEn?.postal_code}
                  <br />
                  {contactEn?.country}
                </p>
              </div>
              <div>
                <p
                  className={`font-medium ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {params.locale === "bod" ? "ཁ་པར་།" : "Phone"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {monastery.contact.phone_number}
                </p>
              </div>
              <div>
                <p
                  className={`font-medium ${
                    params.locale === "bod" && "font-monlamuchen"
                  }`}
                >
                  {params.locale === "bod" ? "ཡིག་འཕྲིན།" : "Email"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {monastery.contact.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
