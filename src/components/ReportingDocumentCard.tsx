"use client";

import { useState } from "react";
import PdfPreviewModal from "@/src/components/PdfPreviewModal";

export type ReportingDocumentLink = {
  id: number;
  label: string;
  fileUrl: string;
};

type ReportingDocumentCardProps = {
  title: string;
  documents: ReportingDocumentLink[];
};

const ReportingDocumentCard = ({
  title,
  documents,
}: ReportingDocumentCardProps) => {
  const [activeDocument, setActiveDocument] =
    useState<ReportingDocumentLink | null>(null);

  const closeModal = (): void => {
    setActiveDocument(null);
  };

  return (
    <>
      <article className="flex min-h-50 flex-col items-center justify-center gap-8 rounded-lg bg-accent p-6 text-center text-secondary">
        <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-none font-semibold">
          {title}
        </h3>

        <div className="flex w-full max-w-80 flex-col gap-5">
          {documents.map((document: ReportingDocumentLink) => (
            <button
              key={document.id}
              type="button"
              onClick={() => {
                setActiveDocument(document);
              }}
              className="group relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-md bg-accent px-6 py-3 text-base font-regular uppercase text-secondary ring-2 ring-secondary"
            >
              <span className="transition duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:-translate-x-8 group-focus-visible:opacity-0">
                {document.label}
              </span>
              <span
                aria-hidden="true"
                className="absolute -translate-x-14 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </article>

      {activeDocument ? (
        <PdfPreviewModal
          title={activeDocument.label}
          fileLink={activeDocument.fileUrl}
          onClose={closeModal}
        />
      ) : null}
    </>
  );
};

export default ReportingDocumentCard;
