import ReportingDocumentCard from "@/src/components/ReportingDocumentCard";
import { getReportings, type Reporting } from "@/src/lib/reportings-api";
import { createPageMetadata } from "@/src/lib/page-metadata";

export const metadata = createPageMetadata("Звітність");

const Reporting = async () => {
  const reportings: Reporting[] = await getReportings();

  return (
    <section>
      <div className="page-container grid grid-cols-1 gap-6 md:grid-cols-2">
        {reportings
          .filter((reporting: Reporting) => reporting.documents.length > 0)
          .map((reporting: Reporting) => (
            <ReportingDocumentCard
              key={reporting.id}
              title={String(reporting.year)}
              documents={reporting.documents}
            />
          ))}
      </div>
    </section>
  );
};

export default Reporting;
