import GalleryGrid from "@/src/components/GalleryGrid";
import { getGalleryImages, type GalleryImage } from "@/src/lib/gallery-api";

export default async function GalleryPage() {
  const images: GalleryImage[] = await getGalleryImages();

  return (
    <section className="page-container">
      {images.length === 0 ? (
        <p className="text-lg text-accent">Галерея поки що не містить зображень.</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </section>
  );
}
