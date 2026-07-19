import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Breadcrumbs from "@/src/components/Breadcrumbs";
import { BreadcrumbProjectTitleProvider } from "@/src/components/BreadcrumbProjectTitle";
import PageHero from "@/src/components/PageHero";
import { getGalleryImages, type GalleryImage } from "@/src/lib/gallery-api";

const fixel = localFont({
  src: [
    {
      path: "./fonts/fixel/FixelVariable.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/fixel/FixelVariableItalic.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fixel-local",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Корпорація «СОЮЗ»",
    template: "%s | Корпорація «СОЮЗ»",
  },
  description: "Українська енергетична компанія",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const galleryImages: GalleryImage[] = await getGalleryImages();
  const heroRandomSeed: string = randomUUID();

  return (
    <html
      lang="en"
      className={`${fixel.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="relative flex-1">
          <BreadcrumbProjectTitleProvider>
            <Breadcrumbs />
            <PageHero galleryImages={galleryImages} randomSeed={heroRandomSeed} />
            {children}
          </BreadcrumbProjectTitleProvider>
        </main>
        <Footer  />
      </body>
    </html>
  );
}
