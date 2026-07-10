import Image from "next/image";

type GenerationFeature = {
  id: number;
  text: string;
};

const epcContractFeatures: GenerationFeature[] = [
  {
    id: 1,
    text: "Попереднє опрацювання проєктів, що містять ТЕО та обґрунтування інвестицій",
  },
  {
    id: 2,
    text: "Комплексне проєктування об'єктів, розробка проєктної та робочої документації, авторський нагляд за будівництвом",
  },
  {
    id: 3,
    text: "Виконання функцій генерального підрядника в будівництві",
  },
  {
    id: 4,
    text: "Постачання обладнання українських та закордонних виробників",
  },
];

const generationFeatures: GenerationFeature[] = [
  {
    id: 1,
    text: "Розробка проєктів будівництва «під ключ» міні-ТЕЦ, розрахованих на спалювання біопалива (солома, відходи деревообробної галузі, брикети, пелети та ін.)",
  },
  {
    id: 2,
    text: "Реконструкція міських котелень, індивідуальних теплових пунктів та комунікацій теплових мереж",
  },
  {
    id: 3,
    text: "Реконструкція систем водоочищення міських водоканалів",
  },
  {
    id: 4,
    text: "Співпраця за програмами Світового та Європейського Банків Реконструкції та Розвитку",
  },
  {
    id: 5,
    text: "Впровадження технологій від провідних світових лідерів у цій галузі: SIEMENS, ENERSTENA, VIESSMANN, EKOL, IVAR, SKODA, TURBODEN, ANSALDO, ALFA LAVAL",
  },
];

export default function Generation() {
  return (
    <section>
      <div className="page-container grid gap-12 text-accent">
        <div
          data-generation-layout="top"
          className="grid gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(20rem,1fr)] lg:items-stretch"
        >
          <article className="flex h-full flex-col gap-5  bg-secondary ">
            <p className="max-w-5xl leading-relaxed">
              <strong className="font-semibold text-accent">
                Бізнес-дивізіон «Генерація»
              </strong>{" "}
              здійснює будівництво об&apos;єктів теплової енергетики на умовах
              «під ключ», комплексне проєктування об&apos;єктів теплової енергетики,
              інженерне консультування і комплексні поставки обладнання для
              об&apos;єктів теплової енергетики.
            </p>

            <div className="relative min-h-[19rem] flex-1 overflow-hidden sm:min-h-[26rem] lg:min-h-[28rem]">
              <Image
                src="/previews/about/about_mainimage_2.jpg"
                alt="Монтаж обладнання енергетичної інфраструктури"
                fill
                priority
                sizes="(max-width: 1024px) calc(100vw - 2rem), 62vw"
                className="object-cover object-center rounded-md"
              />
            </div>
          </article>

          <aside className=" border-l-2 border-accent/20 bg-secondary pl-3">
            <h2 className="mb-4 text-[clamp(1.5rem,2vw,1.75rem)] leading-snug font-semibold text-accent">
              EPC / EPCM контракти
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-[clamp(1.05rem,2vw,1.05rem)] leading-relaxed text-accent/85 marker:text-accent">
              {epcContractFeatures.map((feature: GenerationFeature) => (
                <li key={feature.id}>{feature.text}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div
          data-generation-layout="bottom"
          className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch"
        >
          <div
            data-generation-panel="bottom-text"
            className="flex h-full flex-col gap-4"
          >
            <article className="">
              <p className=" leading-relaxed">
                Корпорація «СОЮЗ» є одним з лідерів в Україні з впровадження
                на її теренах енергоефективних технологій виробництва теплової
                та електричної енергії.
              </p>
            </article>

            <article className="flex-1">
              <h2 className="mb-4 text-[clamp(1.5rem,2vw,1.75rem)] leading-snug font-semibold text-accent">
                Характерні риси сьогодення в роботі бізнес-дивізіону Генерація:
              </h2>

              <ul className="list-disc space-y-2 pl-5 leading-relaxed marker:text-accent">
                {generationFeatures.map((feature: GenerationFeature) => (
                  <li key={feature.id}>{feature.text}</li>
                ))}
              </ul>
            </article>
          </div>

          <div
            data-generation-panel="bottom-image"
            className="relative min-h-[22rem] overflow-hidden rounded-md lg:h-full"
          >
            <Image
              src="/previews/about/defend-renovate.jpg"
              alt="Енергетичне обладнання на промисловому майданчику"
              fill
              sizes="(max-width: 1024px) calc(100vw - 2rem), 42vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
