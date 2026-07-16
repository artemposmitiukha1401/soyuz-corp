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
    imageUrl: "/data_images/divisions/alternative_energy/sec_vyd_zverhu.jpg",
    text: 'Департамент альтернативної енергетики',
    link: "/divisions/alternative-energy",
    width: "full",
  },
  {
    id: 2,
    imageUrl: "/data_images/divisions/generation/zastavka_biznes_dyvizion_generatsiya_turbyna_tes.jpg",
    text: 'Бізнес-дивізіон "Генерація"',
    link: "/divisions/generation",
    width: "standard",
  },
  {
    id: 3,
    imageUrl: "/data_images/divisions/networks/ps_750kv_kakhovska.JPG",
    text: 'Бізнес-дивізіон "Мережі"',
    link: "/divisions/networks",
    width: "standard",
  },
  {
    id: 4,
    imageUrl: "/data_images/divisions/commissioning_bg.jpg",
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
