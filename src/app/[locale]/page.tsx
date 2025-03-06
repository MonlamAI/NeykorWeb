import { useLocale, useTranslations } from "next-intl";
import ImageGallery from "../LocalComponents/Cards/Imagegal";
import Admincard from "../LocalComponents/Admin/Admincard";

export default function Home() {
  const t = useTranslations("index");
  const activelocale = useLocale();
  const stanzaClasses = `max-w-xl mb-4 text-black ${
    activelocale == "bod" 
      && " font-monlam22 md:text-base text-sm font-bold text-black" }`;

  return (
    <div className="w-full flex h-[calc(100vh-10rem)] items-center justify-start p-6 ">
      
      <div className=" relative mt-32 flex items-center">
        <div className="px-4">
          <h1
            className={` text-xl  md:text-3xl md:text-neutral-800 ${
              activelocale == "bod"
                ? " font-tsumachu "
                : " font-black mt-2  max-w-xl uppercase"
            }`}
          >
            {t("title")}
          </h1>
          <p className={stanzaClasses}>{t("stanza1")}</p>
          <p className={stanzaClasses}>{t("stanza2")}</p>
          <p className={stanzaClasses}>{t("stanza3")}</p>
          <p className={stanzaClasses}>{t("stanza4")}</p>
          
          <p className={` ${activelocale=="bod"&& "font-monlamuchen text-lg"}   text-neutral-800 max-w-xl "`}>{t("des")}</p>
        </div>
      </div>

     <Admincard/>
      <ImageGallery />
    </div>
  );
}
