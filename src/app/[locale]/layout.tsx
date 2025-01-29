import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
  title: "Neykor",
  description:
    "Neykor is a platform designed for one-stop access to detailed information about holy places, festivals, and sacred statues",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  return (
    <html lang={locale}>
      <body
        className={`${inter.className} ${monlamuchen.variable} ${monlam22.variable} ${tsumachu.variable} ${monlamTb.variable} antialiased`}
      >
        <div className=" items-center max-w-5xl mx-auto flex flex-col justify-between min-h-screen p-2 ">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
