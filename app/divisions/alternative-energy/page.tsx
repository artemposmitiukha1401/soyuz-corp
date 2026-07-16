import HorizontalInfoCard, {
  type HorizontalInfoCardObject,
} from "@/src/components/HorizontalInfoCard";

type AlternativeEnergyInfoCard = HorizontalInfoCardObject & {
  id: number;
};

const alternativeEnergyInfoCards: AlternativeEnergyInfoCard[] = [
  {
    id: 1,
    
    imageUrl: "/data_images/divisions/alternative_energy/vg_vestas.jpg",
    imageAlt: "Вітрові електростанції у полі",
    title: "Відновлювана енергетика",
    description:
      "Корпорація Союз бере участь в програмах розвитку «зеленої» енергетики:",
    items: [
      "Розробка ТЕО і основних технічних рішень",
      "Розробка схем видачі потужності",
      "Розробка проектної документації",
      "Підбір та постачання устаткування",
      "Будівництво, монтаж та пусконалагодження пристанційних вузлів сонячних і вітрових електростанцій",
      "Будівництво ліній приєднання",
    ],
  },
  {
    id: 2,
    imageUrl: "/data_images/divisions/alternative_energy/sec_vyd_zverhu.jpg",
    imageAlt: "Сонячна електростанція",
    title: "Сонячні електростанції",
    description:
      "Корпорація «Союз» забезпечує повний цикл реалізації проєктів у сфері «зеленої» енергетики:",
    items: [
      "Розробка і проєктування системи",
      "Поставка і монтаж обладнання",
      "Монтаж фундаментів і будівельні роботи",
      "Монтаж опор і панелей",
      "Підстанції та мережеві зв’язки (зв’язок з енергосистемою)",
      "Проведення випробувань і пусконалагоджувальні роботи",
      "Експлуатація та технічне обслуговування",
    ],
  },
  {
    id: 3,
    imageUrl: "/data_images/divisions/alternative_energy/orlovska_vec.jpg",
    imageAlt: "Монтаж вітрової електростанції",
    title: "Вітряні електростанції",
    description:
      "Корпорація «Союз» виконує повний комплекс робіт для об’єктів відновлюваної енергетики — від підготовки майданчика до монтажу турбін і технічного обслуговування.",
    items: [
      "Облаштування тимчасових під’їзних доріг",
      "Монтаж фундаментів і будівельні роботи",
      "Підстанції та кабельне з’єднання",
      "Монтаж турбін",
      "Проведення випробувань і пусконалагоджувальні роботи",
      "Експлуатація та технічне обслуговування",
    ],
  },
];

const AlternativeEnergy = () => (
  <section>
    <div className="page-container flex flex-col gap-10">
      {alternativeEnergyInfoCards.map((card: AlternativeEnergyInfoCard) => (
        <HorizontalInfoCard
          key={card.id}
          imageUrl={card.imageUrl}
          imageAlt={card.imageAlt}
          title={card.title}
          description={card.description}
          items={card.items}
        />
      ))}
    </div>
  </section>
);

export default AlternativeEnergy;
