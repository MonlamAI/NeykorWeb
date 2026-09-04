import { useLocale, useTranslations } from "next-intl";
import { isTibetanLocale } from "@/lib/utils";
import ImageGallery from "../LocalComponents/Cards/Imagegal";
import Image from "next/image";
import wheetimage from "../../../public/wheel.png";
import pata from "../../../public/design.png";
import headerimage from "../../../public/header.jpg";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("index");
  const tmon = useTranslations("monastery");
  const activelocale = useLocale();
  
  const stanzaClasses = `text-black leading-relaxed text-center md:text-left ${
    isTibetanLocale(activelocale)
      ? "font-monlam22 text-base sm:text-lg font-bold"
      : "text-lg sm:text-xl md:text-2xl"
  }`;
  
  return (
    <main className="flex-1 w-full max-w-full flex flex-col">
      <section className="relative left-1/2 z-0 w-screen max-w-[100vw] -translate-x-1/2 -mt-16 h-[46vh] min-h-[280px] shrink-0 overflow-hidden sm:h-[42vh] md:h-[40vh] md:min-h-[220px]">
        <Image
          src={headerimage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[12%_42%] md:object-[center_top]"
        />
      </section>
      <section className="relative w-full bg-white">
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
          <Image src={wheetimage} alt="" width={280} height={280} className="opacity-20" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10 lg:gap-14">
            <blockquote className="flex min-w-0 flex-1 flex-col items-center justify-center text-center md:items-start md:text-left">
              <div className="space-y-2 sm:space-y-3">
                <p className={stanzaClasses}>{t("stanza1")}</p>
                <p className={stanzaClasses}>{t("stanza2")}</p>
                <p className={stanzaClasses}>{t("stanza3")}</p>
                <p className={stanzaClasses}>{t("stanza4")}</p>
              </div>
              <p
                className={`mt-5 max-w-xl text-center text-neutral-700 md:text-left ${
                  isTibetanLocale(activelocale)
                    ? "font-monlam text-sm sm:text-base"
                    : "text-sm sm:text-base"
                }`}
              >
                {t("des")}
              </p>
            </blockquote>
            <ImageGallery />
          </div>
        </div>
      </section>
      <div className={`${isTibetanLocale(activelocale) ? "font-monlam" : ""} bg-[#EDE9E8] min-h-32 h-auto flex-col py-6 px-2 flex items-center justify-center w-full mt-auto`}>
        <div className="inset-0 flex items-start justify-center pointer-events-none">
          <Image src={pata} alt="wheel" width={800} height={200} className="opacity-50"/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 w-full mt-4 mb-2 max-w-4xl px-4 text-black">
          <Link href="https://chorig.org/religious-schools/nyingma" className="rounded-lg py-2 px-3 sm:px-4 bg-white hover:bg-gray-50 transition-colors text-center text-sm" target="_blank" rel="noopener noreferrer">
            {tmon("m1")}
          </Link>
          <Link href="https://chorig.org/religious-schools/kagyu" className="py-2 px-3 sm:px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center text-sm" target="_blank" rel="noopener noreferrer">
            {tmon("m2")}
          </Link>
          <Link href="https://chorig.org/religious-schools/sakya" className="py-2 px-3 sm:px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center text-sm" target="_blank" rel="noopener noreferrer">
            {tmon("m3")}
          </Link>
          <Link href="https://chorig.org/religious-schools/gelug" className="py-2 px-3 sm:px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center text-sm" target="_blank" rel="noopener noreferrer">
            {tmon("m4")}
          </Link>
          <Link href="https://chorig.org/bon" className="py-2 px-3 sm:px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center text-sm" target="_blank" rel="noopener noreferrer">
            {tmon("m5")}
          </Link>
          <Link href="https://chorig.org/religious-schools/jonang" className="py-2 px-3 sm:px-4 rounded-lg bg-white hover:bg-gray-50 transition-colors text-center text-sm" target="_blank" rel="noopener noreferrer">
            {tmon("m7")}
          </Link>
        </div>
      </div>
    </main>
  );
}
