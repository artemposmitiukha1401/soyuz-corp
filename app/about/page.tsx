import AboutSectionCard, {
  type SectionPreviewCard,
} from "@/src/components/SectionPreviewCard";
import { createPageMetadata } from "@/src/lib/page-metadata";

export const metadata = createPageMetadata("Про компанію");

type AboutCard = {
  id: number;
  imageUrl: string;
  text: string;
  link: string;
  width: SectionPreviewCard;
};

const aboutCards: AboutCard[] = [
  {
    id: 1,
    imageUrl: "/previews/about/our-company.jpg",
    text: 'Ми - Корпорація "СОЮЗ"',
    link: "/about/our-company",
    width: "full",
  },
  {
    id: 2,
    imageUrl: "/previews/about/projects_geography.jpg",
    text: "Географія великих проєктів",
    link: "/about/projects-geography",
    width: "standard",
  },
  {
    id: 3,
    imageUrl: "/previews/about/partners.jpg",
    text: "Замовники та партнери",
    link: "/about/cooperation",
    width: "standard",
  },
  {
    id: 4,
    imageUrl: "/previews/about/defend-renovate.jpg",
    text: "Захищаємо та відновлюємо",
    link: "/about/protect-and-restore",
    width: "standard",
  },
  {
    id: 5,
    imageUrl: "/previews/about/without_corruption.avif",
    text: "Антикорупційний комплаєнс",
    link: "/about/anti-corruption-compliance",
    width: "standard",
  },
  {
    id: 6,
    imageUrl: "/previews/about/reporting.jpg",
    text: "Звітність",
    link: "about/reporting",
    width: "standard",
  },
  {
    id: 7,
    imageUrl: "/previews/about/reaching-win.jpg",
    text: "Наближаємо перемогу",
    link: "about/reaching-win",
    width: "standard",
  },
  {
    id: 8,
    imageUrl: "/previews/about/achievements.jpg",
    text: "Наші досягнення",
    link: "about/achievements",
    width: "half",
  },
  {
    id: 9,
    imageUrl: "/previews/about/office-image.jpg",
    text: "Наші контакти",
    link: "about/contacts",
    width: "half",
  },
];

export default function About() {
  return (
    <section>
      <div className="page-container grid grid-cols-1 gap-4 md:grid-cols-6">
        {aboutCards.map((card: AboutCard) => (
          <AboutSectionCard
            key={card.id}
            imageUrl={card.imageUrl}
            text={card.text}
            link={card.link}
            width={card.width}
          />
        ))}
      </div>
    </section>
  );
}
