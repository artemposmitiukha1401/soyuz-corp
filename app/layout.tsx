import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Breadcrumbs from "@/src/components/Breadcrumbs";
import PageHero from "@/src/components/PageHero";

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
  title: "Soyuz Corp",
  description: "Ukrainian energy company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fixel.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="relative flex-1">
          <Breadcrumbs/>
          <PageHero/>
          {children}</main>
        <Footer  />
      </body>
    </html>
  );
}
