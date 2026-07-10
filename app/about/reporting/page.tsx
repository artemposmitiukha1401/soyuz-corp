import ReportingDocumentCard, {
  type ReportingDocumentLink,
} from "@/src/components/ReportingDocumentCard";

type ReportingCard = {
  id: number;
  title: string;
  documents: ReportingDocumentLink[];
};

const reportingCards: ReportingCard[] = [
  {
    id: 1,
    title: "2021",
    documents: [
      {
        id: 1,
        label: "Фінансова звітність",
        fileLink: "dfdfggg",
      },
      {
        id: 2,
        label: "Звітність про управління",
        fileLink: "dssdfgd",
      },
    ],
  },
  {
    id: 2,
    title: "2022",
    documents: [
      {
        id: 1,
        label: "Фінансова звітність",
        fileLink: "",
      },
      {
        id: 2,
        label: "Звітність про управління",
        fileLink: "",
      },
    ],
  },
];

const Reporting = () => (
  <section>
    <div className="page-container grid grid-cols-1 gap-6 md:grid-cols-2">
      {reportingCards.map((card: ReportingCard) => (
        <ReportingDocumentCard
          key={card.id}
          title={card.title}
          documents={card.documents}
        />
      ))}
    </div>
  </section>
);

export default Reporting;
