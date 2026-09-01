import { redirect } from "@/i18n/routing";

export default function AccessPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect({ href: "/admin", locale });
}
