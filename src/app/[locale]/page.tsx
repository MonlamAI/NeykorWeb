import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("index");
  return <div className=" ">{t("title")}</div>;
}
