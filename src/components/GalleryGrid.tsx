"use client";

import { useEffect, useState } from "react";

import type { GalleryImage } from "@/src/lib/gallery-api";

type GalleryGridProps = {
  images: GalleryImage[];
};

type GalleryPreviewProps = {
  image: GalleryImage;
  onClose: () => void;
};

const GalleryPreview = ({ image, onClose }: GalleryPreviewProps) => {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return (): void => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-accent/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Перегляд зображення: ${image.altText}`}
        className="relative flex h-full w-full max-w-6xl items-center justify-center"
      >
        <img
          src={image.url}
          alt={image.altText}
          className="max-h-full max-w-full object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити перегляд зображення"
          className="group absolute right-2 top-2 inline-flex min-h-11 min-w-32 items-center justify-center overflow-hidden rounded-md border  px-4 py-2 text-base font-medium text-secondary ring-1 ring-secondary/35"
        >
          <span className="transition duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:-translate-x-8 group-focus-visible:opacity-0">
            Закрити
          </span>
          <span
            aria-hidden="true"
            className="absolute -translate-x-14 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </section>
    </div>
  );
};

const GalleryGrid = ({ images }: GalleryGridProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const closePreview = (): void => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image: GalleryImage) => (
          <button
            key={image.key}
            type="button"
            onClick={() => {
              setSelectedImage(image);
            }}
            className="overflow-hidden rounded-md bg-accent/10 text-left ring-1 ring-accent/20 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={`Відкрити зображення: ${image.altText}`}
          >
            <img
              src={image.url}
              alt={image.altText}
              className="aspect-4/3 h-auto w-full object-cover transition duration-300 hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {selectedImage === null ? null : (
        <GalleryPreview image={selectedImage} onClose={closePreview} />
      )}
    </>
  );
};

export default GalleryGrid;
