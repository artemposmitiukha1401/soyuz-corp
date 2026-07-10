"use client";

import { useState } from "react";
import PdfPreviewModal from "@/src/components/PdfPreviewModal";

export type PdfPreviewCardWidth = "full" | "standard";

type PdfPreviewCardProps = {
  width: PdfPreviewCardWidth;
  text: string;
  fileLink: string;
};

const cardWidthClasses: Record<PdfPreviewCardWidth, string> = {
  full: "md:col-span-2",
  standard: "md:col-span-1",
};

const PdfPreviewCard = ({ width, text, fileLink }: PdfPreviewCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <>
      <article
        className={`${cardWidthClasses[width]} flex min-h-32 flex-col items-center justify-center gap-7 rounded-lg bg-accent p-4 text-center text-secondary sm:min-h-42`}
      >
        <h3 className="text-[clamp(1.5rem,3vw,2rem)] leading-none font-semibold">
          {text}
        </h3>

        <button
          type="button"
          onClick={openModal}
          className="group relative inline-flex min-h-10 w-full max-w-54 items-center justify-center overflow-hidden rounded-md bg-accent px-6 py-2 text-base font-semibold uppercase text-secondary ring-2 ring-secondary"
        >
          <span className="transition duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:-translate-x-8 group-focus-visible:opacity-0">
            Детальніше
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
      </article>

      {isModalOpen ? (
        <PdfPreviewModal title={text} fileLink={fileLink} onClose={closeModal} />
      ) : null}
    </>
  );
};

export default PdfPreviewCard;
