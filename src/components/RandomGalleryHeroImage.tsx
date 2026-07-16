import type { ReactNode } from "react";

import PageTitleGenerator from "@/src/components/PageTitleGenerator";
import type { GalleryImage } from "@/src/lib/gallery-api";

type RandomGalleryHeroImageProps = {
  fallbackImageUrl: string;
  images: GalleryImage[];
  pageKey: string;
  randomSeed: string;
  text: string;
};

const getImageUrl = (
  fallbackImageUrl: string,
  images: GalleryImage[] | undefined,
  pageKey: string,
  randomSeed: string,
): string => {
  if (images === undefined || images.length === 0) {
    return fallbackImageUrl;
  }

  const selectionKey: string = `${randomSeed}:${pageKey}`;
  let hash: number = 0;

  for (const character of selectionKey) {
    hash = Math.imul(31, hash) + character.charCodeAt(0);
  }

  const imageIndex: number = (hash >>> 0) % images.length;
  return images[imageIndex].url;
};

const RandomGalleryHeroImage = ({
  fallbackImageUrl,
  images,
  pageKey,
  randomSeed,
  text,
}: RandomGalleryHeroImageProps): ReactNode => {
  const imageUrl: string = getImageUrl(fallbackImageUrl, images, pageKey, randomSeed);

  return <PageTitleGenerator imageUrl={imageUrl} text={text} />;
};

export default RandomGalleryHeroImage;
