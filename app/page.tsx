import AboutIntro from "@/src/components/AboutIntro";
import HeroBlock from "@/src/components/HeroBlock";
import { createPageMetadata } from "@/src/lib/page-metadata";

export const metadata = createPageMetadata("Головна");

export default function Home() {
  return (
    <>
      <HeroBlock />
      <AboutIntro />
    </  >
  );
}
