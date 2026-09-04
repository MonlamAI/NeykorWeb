import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../LocalComponents/Navbarthings/Navbar";
import Footer from "../LocalComponents/Footer";
import AuthProvider from "../Providers/AuthProvider";
import { NextIntlClientProvider } from "next-intl";
import { QueryProviders } from "../Providers/QueryProvider";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "../Providers/ThemeProvider";
import { RoleProvider } from "../Providers/ContextProvider";
import BackgroundWrapper from "@/lib/backgroundwrapper";

const inter = Inter({ subsets: ["latin"] });
const monlamTb = localFont({
  src: "../fonts/MonlamTBslim.ttf",
  variable: "--font-monlam",
});
const monlamuchen = localFont({
  src: "../fonts/MonlamUniOuChan.ttf",
  variable: "--font-monlamuchen",
});
const monlam22 = localFont({
  src: "../fonts/MonlamTB2022.ttf",
  variable: "--font-monlam22",
});
const tsumachu = localFont({
  src: "../fonts/Tsumachu.woff2",
  variable: "--font-tsumachu",
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale === "bod" ? "bo" : params.locale;
  const messages = await getMessages(locale);
  const name = messages?.navbar?.name || "Neykor";
  const description =
    messages?.index?.des ||
    "Neykor is a platform designed for one-stop access to detailed information about holy places, festivals, and sacred statues";
  const siteUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL;
  const canonicalPath = `/${locale}`;

  return {
    title: `${name} | Neykor`,
    description,
    ...(siteUrl
      ? {
        metadataBase: new URL(siteUrl),
        alternates: {
          canonical: canonicalPath,
          languages: {
            en: "/en",
            bo: "/bo",
            hi: "/hi",
            "x-default": "/bo",
          },
        },
        openGraph: {
          title: `${name} | Neykor`,
          description,
          locale: locale === "hi" ? "hi_IN" : locale === "bo" ? "bo" : "en_US",
          url: canonicalPath,
          siteName: "Neykor",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${name} | Neykor`,
          description,
        },
      }
      : {}),
  };
}

async function getMessages(locale: string) {
  const fileLocale = locale === "bod" ? "bo" : locale;
  try {
    return (await import(`../../../messages/${fileLocale}.json`)).default;
  } catch (error) {
    return (await import(`../../../messages/en.json`)).default;
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  const messages = await getMessages(locale);
  return (
    <html lang={locale === "bod" ? "bo" : locale}>
      <body
        className={`${inter.className} ${monlamuchen.variable} ${monlam22.variable} ${tsumachu.variable} ${monlamTb.variable} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <QueryProviders>
              <AuthProvider>
                <RoleProvider>

                  <div className="relative">
                    <BackgroundWrapper>
                      <div className="items-center px-2 mx-auto flex flex-col min-h-dvh w-full">
                        <Navbar />
                        {children}
                        <Footer />
                      </div>
                      <Toaster />
                    </BackgroundWrapper>

                  </div>
                </RoleProvider>
              </AuthProvider>
            </QueryProviders>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
