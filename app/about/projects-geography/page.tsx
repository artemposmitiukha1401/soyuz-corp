import Image from "next/image"

import { createPageMetadata } from "@/src/lib/page-metadata";

export const metadata = createPageMetadata("Географія великих проєктів");


type PorjectsGeographyImage = {
  src: string;
  alt: string;
};

const mapImage: PorjectsGeographyImage = {
  src: "/data_images/projects_geography.png",
  alt: "Мапа проєктів",
};
const ProjectsGeography = () => {
    return(
    <section className="page-container">
        <Image src={mapImage.src} alt={mapImage.alt} width={1610} height={977} className="w-full h-full"></Image>
    </section>
    );
}

export default ProjectsGeography;
