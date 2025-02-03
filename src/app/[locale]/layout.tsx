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

export const metadata: Metadata = {
  title: "གནས་སྐོར། | Neykor",
  description:
    "Neykor is a platform designed for one-stop access to detailed information about holy places, festivals, and sacred statues",
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
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
    <html lang={locale}>
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
                <div className="items-center  max-screen mx-auto flex flex-col justify-between min-h-screen   ">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
                <Toaster />
              </AuthProvider>
            </QueryProviders>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
