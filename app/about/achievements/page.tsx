import PdfPreviewCard, {
  type PdfPreviewCardWidth,
} from "@/src/components/PdfPreviewCard";
import { createPageMetadata } from "@/src/lib/page-metadata";

export const metadata = createPageMetadata("Наші досягнення");

type AchievementDocumentCard = {
  id: number;
  width: PdfPreviewCardWidth;
  text: string;
  fileLink: string;
};

const achievementDocumentCards: AchievementDocumentCard[] = [
  {
    id: 1,
    width: "standard",
    text: "Почесна грамота КМУ",
    fileLink: "/diplomas/soyuz_pochesna_gramota_kmu_2021.pdf",
  },
  {
    id: 2,
    width: "standard",
    text: "Почесна грамота ОДА",
    fileLink: "/diplomas/soyuz_pochesna_gramota_oda_2021.pdf",
  },
];

const Achievements = () => {
   return (
     <section>
        <article className="page-container text-accent flex flex-col gap-4">
            <p>
                Запорукою успіху та розвитку Корпорації «Союз» є люди, які своїм професіоналізмом, небайдужістю, фаховістю створюють імідж та капітал компанії. Ми пишаємось результатами плідної професійної праці фахівців Корпорації «Союз», які своїми знаннями, досвідом, своєю щоденною самовіддачею забезпечують стабільність, надійність, безпеку та незалежність енергосистеми України.
    </p>
<p>Плідну працю Корпорації «Союз» було відзначено державними нагородами. В 2021 році за успішну реалізацію державних проєктів, які мають важливе значення для енергетичної безпеки України колектив Корпорації «Союз» відзначено Почесною грамотою Кабінету Міністрів України. За час діяльності Корпорації «Союз» ряд співробітників було удостоєно високих урядових нагород.</p>

<p>За вагомі трудові досягнення у галузі енергетики, особисті заслуги у реалізації державних програм щодо забезпечення національної енергетичної безпеки України орденами нагороджено три співробітника. Трьом нашим колегам присвоєно високе почесне званням «Заслужений енергетик України» та два фахівця мають звання - «Заслужений економіст України». Чотири працівника нагороджені Почесною грамотою Кабінету Міністрів України. П’ятьох співробітників відзначено відомчими нагородами Міненергетики України та НЕК «Укренерго», вісім - відзнаками Одеської обласної Державної адміністрації та облради.</p>

<p>Головним досягненням нашого колективу є те, що поряд з досвідченими фахівцями зростають молоді колеги. Які не лише здобувають досвід на будівельних майданчиках, але й стають надійним професійним «фундаментом» для подальшого розвитку Корпорації «Союз». Ми готові до нових трудових звершень!</p>
            
        </article>
        <div className="page-container mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {achievementDocumentCards.map((card: AchievementDocumentCard) => (
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

}

export default Achievements;
