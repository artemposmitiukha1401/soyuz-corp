"use client";

import { useEffect } from "react";

type PdfPreviewModalProps = {
  title: string;
  fileLink: string;
  onClose: () => void;
};

const PdfPreviewModal = ({
  title,
  fileLink,
  onClose,
}: PdfPreviewModalProps) => {
  const hasFileLink: boolean = fileLink.trim().length > 0;

  useEffect(() => {
    const closeModalOnEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeModalOnEscape);

    return (): void => {
      document.removeEventListener("keydown", closeModalOnEscape);
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-accent/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Перегляд PDF: ${title}`}
        className="pdf-preview-modal flex h-[min(90svh,54rem)] w-full max-w-6xl flex-col overflow-hidden rounded-md bg-background shadow-lg"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="pdf-preview-header bg-accent flex items-center justify-between gap-4 px-5 py-4 text-secondary">
          <h2 className="text-lg font-semibold sm:text-2xl">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити перегляд PDF"
            className="group relative inline-flex min-h-11 min-w-32 items-center justify-center overflow-hidden rounded-md border px-4 py-2 text-base font-medium text-secondary ring-1 ring-secondary/35"
          >
            <span className="transition duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:-translate-x-8 group-focus-visible:opacity-0">
              Закрити
            </span>
            <span
              aria-hidden="true"
              className="absolute -translate-x-14 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        </header>

        {hasFileLink ? (
          <iframe
            title={title}
            src={fileLink}
            className="min-h-0 flex-1 w-full bg-secondary"
          />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center p-8 text-center text-lg font-medium text-accent">
            PDF файл ще не додано.
          </div>
        )}
      </section>
    </div>
  );
};

export default PdfPreviewModal;
