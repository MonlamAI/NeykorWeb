import { useLocale, useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("index");
  const activelocale = useLocale();

  return (
    <div className="relative flex-col flex p-4 h-[32rem] w-full  bg-fixed bg-cover bg-center bg-[url('../../public/background.jpg')]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/0 rounded-xl" />
      <div className="relative z-10">
        <p
          className={`text-neutral-100  ${
            activelocale == "bod"
              ? "font-tsumachu text-3xl mt-2"
              : "font-black text-xl  uppercase"
          }`}
        >
          {t("title")}
        </p>
        <p
          className={`text-neutral-300 max-w-xl ${
            activelocale == "bod" ? "font-monlamuchen text-lg" : "  "
          }`}
        >
          {t("stanza1")}
        </p>
        <p
          className={`text-neutral-300 max-w-xl ${
            activelocale == "bod" ? "font-monlamuchen text-lg" : " text-sm "
          }`}
        >
          {t("stanza2")}
        </p>
        <p
          className={`text-neutral-300 max-w-xl ${
            activelocale == "bod" ? "font-monlamuchen text-lg" : " text-sm "
          }`}
        >
          {t("stanza3")}
        </p>
        <p
          className={`text-neutral-300 max-w-xl ${
            activelocale == "bod" ? "font-monlamuchen text-lg" : " text-sm "
          }`}
        >
          {t("stanza4")}
        </p>
        <p
          className={`text-neutral-300 max-w-xl ${
            activelocale == "bod" ? "font-monlamuchen text-lg" : " text-sm "
          }`}
        >
          {t("stanza5")}
        </p>
      </div>
    </div>
  );
}
