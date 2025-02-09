import { useLocale, useTranslations } from "next-intl";
import ImageGallery from "../LocalComponents/Cards/Imagegal";

export default function Home() {
  const t = useTranslations("index");
  const activelocale = useLocale();
  const stanzaClasses = `max-w-xl mb-4 ${
    activelocale == "bod" 
      ? " font-monlam22 md:text-lg text-sm font-bold" 
      : "text-sm text-justify  "
  }`;

  return (
    <div className="w-full ">
      <div className="h-[25vh]  relative flex items-center">
        <div className="px-4">
          <h1
            className={` text-xl  md:text-3xl md:text-neutral-800  dark:text-neutral-200 ${
              activelocale == "bod"
                ? " font-tsumachu md:mt-80 mt-"
                : " font-black mt-60 max-w-xl uppercase"
            }`}
          >
            {t("title")}
          </h1>
        </div>
      </div>

      <div className="px-4 mt-11 py-8 bg-transparent">
        <p className="font-monlamuchen mb-10 text-lg max-w-xl">{t("des")}</p>
        <div className="space-y-4">
          <p className={stanzaClasses}>{t("stanza1")}</p>
          <p className={stanzaClasses}>{t("stanza2")}</p>
          <p className={stanzaClasses}>{t("stanza3")}</p>
          <p className={stanzaClasses}>{t("stanza4")}</p>
        </div>
      </div>
      <ImageGallery />
    </div>
  );
}
