import { useLocale, useTranslations } from "next-intl";
import ImageGallery from "../LocalComponents/Cards/Imagegal";
import Image from "next/image";
import wheetimage from "../../../public/wheel.png";
import pata from "../../../public/design.png";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("index");
  const tmon = useTranslations("monastery");
  const activelocale = useLocale();
  
  const stanzaClasses = `max-w-xl mb-4 text-black ${
    activelocale === "bod"
      ? "font-monlam22 md:text-lg text-base font-bold text-black"
      : "md:text-4xl text-base"
  }`;
  
  return (
    <main className="flex-1 w-[calc(100vw-20px)] flex flex-col">
      <div className="relative flex-1 flex items-center justify-around mt-48 px-4 md:px-8 py-8 mx-auto w-full">
        <div className="absolute hidden md:flex inset-0 items-center justify-center pointer-events-none">
          <Image src={wheetimage} alt="wheel" width={300} height={300} className="opacity-50"/>
        </div>
        <div className="flex-1 max-w-4xl">
          <p className={stanzaClasses}>{t("stanza1")}</p>
          <p className={stanzaClasses}>{t("stanza2")}</p>
          <p className={stanzaClasses}>{t("stanza3")}</p>
          <p className={stanzaClasses}>{t("stanza4")}</p>
          <p className={`${activelocale === "bod" ? "font-monlamuchen text-lg" : ""} text-neutral-800 max-w-xl`}>
            {t("des")}
          </p>
        </div>
        <ImageGallery />
      </div>
      <div className={`${activelocale !== "en" ? "font-monlamuchen" : ""} bg-[#EDE9E8] h-36 flex-col py-4 px-2 flex items-center justify-center w-full`}>
        <div className="inset-0 flex items-start justify-center pointer-events-none">
          <Image src={pata} alt="wheel" width={800} height={200} className="opacity-50"/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 w-full mt-8 mb-11 md:mb-2 max-w-4xl px-4 text-black">
          <Link href="https://chorig.org/religious-schools/nyingma" className="rounded-lg py-2 px-4 bg-white hover:bg-gray-50 transition-colors text-center" target="_blank" rel="noopener noreferrer">
            {tmon("m1")}
          </Link>
          <Link href="https://chorig.org/religious-schools/kagyu" className="py-2 px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center" target="_blank" rel="noopener noreferrer">
            {tmon("m2")}
          </Link>
          <Link href="https://chorig.org/religious-schools/sakya" className="py-2 px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center" target="_blank" rel="noopener noreferrer">
            {tmon("m3")}
          </Link>
          <Link href="https://chorig.org/religious-schools/gelug" className="py-2 px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center" target="_blank" rel="noopener noreferrer">
            {tmon("m4")}
          </Link>
          <Link href="https://chorig.org/bon" className="py-2 px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center" target="_blank" rel="noopener noreferrer">
            {tmon("m5")}
          </Link>
          <Link href="https://chorig.org/religious-schools/jonang" className="py-2 px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center" target="_blank" rel="noopener noreferrer">
            {tmon("m7")}
          </Link>
        </div>
      </div>
    </main>
  );
}