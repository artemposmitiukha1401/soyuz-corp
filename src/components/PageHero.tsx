"use client";

import { usePathname } from "next/navigation";
import RandomGalleryHeroImage from "@/src/components/RandomGalleryHeroImage";
import { routeConfig, type RouteConfig } from "@/src/config/routes";
import type { GalleryImage } from "@/src/lib/gallery-api";

type PageHeroProps = {
  galleryImages: GalleryImage[];
  randomSeed: string;
};

const PageHero = ({ galleryImages, randomSeed }: PageHeroProps) => {
  const pathname: string = usePathname();
  const pageConfig: RouteConfig | undefined = routeConfig[pathname];

  if (!pageConfig) {
    return null;
  }

  return (
    <RandomGalleryHeroImage
      fallbackImageUrl={pageConfig.imageUrl}
      images={galleryImages}
      pageKey={pathname}
      randomSeed={randomSeed}
      text={pageConfig.title}
    />
  );
};

export default PageHero;
