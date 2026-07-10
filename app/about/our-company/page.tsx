import PdfPreviewCard, {
  type PdfPreviewCardWidth,
} from "@/src/components/PdfPreviewCard";
import Image from "next/image";

type AboutInformationImage = {
  src: string;
  alt: string;
};

type AboutDocumentCard = {
  id: number;
  width: PdfPreviewCardWidth;
  text: string;
  fileLink: string;
};

const leftImage: AboutInformationImage = {
  src: "/previews/about/about_mainimage_2.jpg",
  alt: "Фахівці корпорації Союз працюють на опорі лінії електропередач",
};

const topImage: AboutInformationImage = {
  src: "/previews/about/soyuz.jpg",
  alt: "Логотип корпорації Союз",
};

const aboutDocumentCards: AboutDocumentCard[] = [
  {
    id: 1,
    width: "full",
    text: "Читати повний текст",
    fileLink: "",
  },
  {
    id: 2,
    width: "standard",
    text: "ISO 45001 2018",
    fileLink: "",
  },
  {
    id: 3,
    width: "standard",
    text: "ДСТУ EN ISO 9001 2018",
    fileLink: "",
  },
  {
    id: 4,
    width: "standard",
    text: "ISO 45001 2015",
    fileLink: "",
  },
  {
    id: 5,
    width: "standard",
    text: "ДСТУ ISO 14001 2015 ISO 14001 2015 IDT",
    fileLink: "",
  },
  {
    id: 6,
    width: "standard",
    text: "ДСТУ ISO 14001 2015 ISO 14001 2018 IDT",
    fileLink: "",
  },
  {
    id: 7,
    width: "standard",
    text: "ISO 9001 2015",
    fileLink: "",
  },
];

const OurCompany = () => (
  <section className="page-container">
    <div className=" grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.05fr)] lg:items-stretch mb-14">
      <div className="relative min-h-[34rem] overflow-hidden rounded-lg sm:min-h-[46rem] lg:h-full lg:min-h-0">
        <Image
          src={leftImage.src}
          alt={leftImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) calc(100vw - 2rem), 43vw"
          className="object-cover object-center"
        />
      </div>

      <div className="grid gap-6">
        <div className="relative min-h-[18rem] overflow-hidden rounded-lg sm:min-h-[24rem] lg:aspect-[16/9] lg:min-h-0">
          <Image
            src={topImage.src}
            alt={topImage.alt}
            fill
            sizes="(max-width: 1024px) calc(100vw - 2rem), 49vw"
            className="object-cover object-center"
          />
        </div>

        <article className="flex items-center h-fit  text-accent ">
          <p>
            <strong className="font-medium">
              Ми, Корпорація виробничих та комерційних підприємств «Союз»
              (Корпорація «Союз»),
            </strong>{" "}
            - колектив фахівців, який здатен виконати задачі будь-якої
            складності в енергетичній галузі. Пріоритетом у роботі для нас є
            ефективне вирішення завдань різної складності у встановлені
            терміни в межах узгодженого бюджету. Ми працюємо за двома
            основними форматами міжнародних стандартів з управління проєктами
            в будівництві - EPCM або EPC договорів.
          </p>
        </article>
      </div>
      
    </div>

<p className="text-[clamp(1.05rem,2vw,1.05rem)] leading-[1.45] text-accent">
        Інтегрована система управління діяльністю Корпорації «Союз» дозволяє нам працювати більш ефективно, знижувати витрати та підвищувати якість продукції та відповідає вимогам міжнародних стандартів: ISO 9001:2015; ISO 14001:2015; ISO 45001:2018.

Наша компанія спеціалізується на виконанні проєктів «під ключ» в енергетиці й промисловості та пропонує своїм Замовникам комплексні рішення з побудови єдиних систем енергозабезпечення підприємств, що включають реконструкцію і будівництво нових потужностей і всієї необхідної енергетичної інфраструктури.

За останні роки Корпорація «Союз» ввела в експлуатацію понад 50 значних енергетичних об’єктів в Україні.

Запорукою успіху Корпорації «Союз» є професійна, злагоджена команда однодумців. Колектив компанії – це висококваліфіковані спеціалісти в галузі проєктування, будівництва та наладки складного високотехнологічного обладнання об’єктів електро- і теплоенергетики, що відносяться до об’єктів критичної інфраструктури України. Корпорація «Союз» має всі необхідні документи, у тому числі ліцензії та дозволи, необхідні для забезпечення можливості виконання всього спектру робіт з проєктування, будівництва, монтажу та пусконалагодження на енергетичних об’єктах напругою 110 -750 кВ.

Наявність власної виробничої бази, необхідної спецтехніки, технологічного обладнання та оснащення, професійного кваліфікаційного персоналу, який має допуски для виконання всіх видів робіт напругою до 750 кВ включно – все це дозволяє виконувати технічно складні роботи на якісному рівні, у встановлені терміни з дотриманням чинних норм та правил. 
    </p>

    <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
      {aboutDocumentCards.map((card: AboutDocumentCard) => (
        <PdfPreviewCard
          key={card.id}
          width={card.width}
          text={card.text}
          fileLink={card.fileLink}
        />
      ))}
    </div>
  </section>
);

export default OurCompany;
