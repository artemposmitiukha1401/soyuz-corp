import AboutSectionCard, {
  type SectionPreviewCard,
} from "@/src/components/SectionPreviewCard";

type DivisionCard = {
  id: number;
  imageUrl: string;
  text: string;
  link: string;
  width: SectionPreviewCard;
};

const aboutCards: DivisionCard[] = [
  {
    id: 1,
    imageUrl: "/previews/about/our-company.jpg",
    text: 'Департамент альтернативної енергетики',
    link: "/divisions/alternative-energy",
    width: "full",
  },
  {
    id: 2,
    imageUrl: "/previews/about/projects_geography.jpg",
    text: 'Бізнес-дивізіон "Генерація"',
    link: "/divisions/generation",
    width: "standard",
  },
  {
    id: 3,
    imageUrl: "/previews/about/partners.jpg",
    text: 'Бізнес-дивізіон "Мережі"',
    link: "/divisions/networks",
    width: "standard",
  },
  {
    id: 4,
    imageUrl: "/previews/about/defend-renovate.jpg",
    text: "Проєктування",
    link: "/divisions/commissioning",
    width: "standard",
  },

];

export default function About() {
  return (
    <section>
      <div className="page-container grid grid-cols-1 gap-4 md:grid-cols-6">
        {aboutCards.map((card: DivisionCard) => (
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
