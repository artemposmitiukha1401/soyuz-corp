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
        className="flex h-[min(90svh,54rem)] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-background shadow-lg"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="flex items-center justify-between gap-4 bg-accent px-5 py-4 text-secondary">
          <h2 className="text-lg font-semibold sm:text-2xl">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити перегляд PDF"
            className="liquid-glass-hover inline-flex size-10 items-center justify-center rounded-md text-2xl leading-none text-secondary"
          >
            ×
          </button>
        </header>

        {hasFileLink ? (
          <iframe title={title} src={fileLink} className="h-full w-full bg-secondary" />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-lg font-medium text-accent">
            PDF файл ще не додано.
          </div>
        )}
      </section>
    </div>
  );
};

export default PdfPreviewModal;
