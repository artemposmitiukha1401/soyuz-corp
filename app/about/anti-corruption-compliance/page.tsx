import PdfPreviewCard from "@/src/components/PdfPreviewCard";

const hotlineItems: string[] = [
  "Уповноважений з антикорупційної діяльності: Кучеренко Дмитро",
  "Лінія довіри доступна цілодобово. Електронна пошта: dkucherenko@soyuz-corp.com.ua",
  "Телефон: +38 (050) 392 83 12",
];

const reportItems: string[] = [
  "Загрози або порушення у сфері охорони праці, здоров’я і безпеки людей або навколишнього середовища.",
  "Зловживання, корупція або неправомірне привласнення чи використання активів.",
  "Залякування, переслідування, домагання або дискримінація.",
  "Викривлення фінансової звітності або розкриття конфіденційної інформації.",
  "Порушення Антимонопольного законодавства або недобросовісна конкуренція.",
];

const AntiCorruptionCompliance = () => (
    <section>
      <div className="page-container space-y-8 text-accent">
        <article className="flex flex-col gap-4">
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold mb-4">
            Контакти лінії довіри
          </h2>

          <div className="space-y-5 ">
            <p className="font-medium">
              Лінія довіри створена з метою отримання інформації про
              шахрайські, корупційні та інші правопорушення, що завдають шкоди
              інтересам Корпорації, її чинним та потенційним партнерам.
            </p>
          </div>

          <ol className="list-decimal pl-4  marker:text-accent">
            {hotlineItems.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ol>

          <div className="">
            <p>
              Дзвінки опрацьовуються в робочі дні з 09:00 до 18:00. В
              неробочий час ви можете залишити повідомлення на автовідповідач -
              повідомити своє ПІБ або ж анонімно - на ваш вибір.
            </p>
            <p>
              Інформація, що викладена в отриманих повідомленнях, перевіряється
              на відповідність та наявність корупційних ознак. Анонімні
              повідомлення підлягають розгляду у випадку, якщо наведена у них
              інформація стосується конкретної особи, містить фактичні дані,
              які можуть бути перевірені.
            </p>
          </div>
        </article>

        <article className="space-y-6 ">
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold">
            Про що ви можете повідомити
          </h2>

          <ol className="list-decimal space-y-2 pl-4  marker:text-accent">
            {reportItems.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>

        
          <PdfPreviewCard
            width="full"
            text="Антикорупційна програма"
            fileLink="/documents/anti_corrupt.pdf"
          />
        
      </div>
    </section>
);

export default AntiCorruptionCompliance;
