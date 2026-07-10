"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroBackgroundImage = {
  id: number;
  src: string;
  alt: string;
};

const heroBackgroundImages: HeroBackgroundImage[] = [
  {
    id: 1,
    src: "/hero-image.avif",
    alt: "",
  },
  {
    id: 2,
    src: "/ukraine-europe.png ",
    alt: "",
  },
];

const backgroundChangeDelayMs = 5000;

const getNextImageIndex = (
  currentImageIndex: number,
  imagesCount: number,
): number => (currentImageIndex + 1) % imagesCount;

const HeroBlock = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    if (heroBackgroundImages.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentImageIndex: number) =>
        getNextImageIndex(currentImageIndex, heroBackgroundImages.length),
      );
    }, backgroundChangeDelayMs);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative isolate h-[calc(100svh-6.5rem)] overflow-hidden bg-accent p-0 text-secondary">
      {heroBackgroundImages.map((image, imageIndex) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          fill
          priority={imageIndex === 0}
          sizes="100vw"
          className={`z-[-2] object-cover object-center transition-opacity duration-1000 ease-in-out ${
            imageIndex === activeImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 z-[-1] bg-accent/45" />
      <div className="absolute inset-0 z-[-1] bg-linear-to-r from-accent/35 via-accent/10 to-transparent" />

      <div className="page-container flex h-full flex-col justify-start py-10 sm:py-14 lg:py-20">
        <div className="max-w-4xl">
          <h1 className="text-[clamp(2rem,5vw,3.65rem)] leading-[1.25] font-semibold text-secondary uppercase">
            Корпорація виробничих та комерційних підприємств
          </h1>

          <h3 className="mt-5 max-w-2xl text-[clamp(1.35rem,3vw,2.5rem)] leading-[1.38] font-normal text-secondary">
            Сила та ємкість
            <br />
            професійних
            <br />
            рішень
          </h3>

        
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;
