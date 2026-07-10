import Image from "next/image";
import Link from "next/link";

export type SectionPreviewCard = "full" | "half" | "standard";

type AboutSectionCardProps = {
  imageUrl: string;
  text: string;
  link: string;
  width: SectionPreviewCard;
};

const cardWidthClasses: Record<SectionPreviewCard, string> = {
  full: "md:col-span-6",
  half: "md:col-span-3",
  standard: "md:col-span-2",
};

const cardHeightClasses: Record<SectionPreviewCard, string> = {
  full: "min-h-72 sm:min-h-80",
  half: "min-h-72",
  standard: "min-h-72",
};

const cardSizes: Record<SectionPreviewCard, string> = {
  full: "(max-width: 768px) 100vw, 70rem",
  half: "(max-width: 768px) 100vw, 35rem",
  standard: "(max-width: 768px) 100vw, 23rem",
};

const contentClasses: Record<SectionPreviewCard, string> = {
  full: "items-end justify-end text-right",
  half: "items-end justify-end text-right",
  standard: "items-end justify-end text-right",
};

const AboutSectionCard = ({
  imageUrl,
  text,
  link,
  width,
}: AboutSectionCardProps) => (
  <article
    className={`${cardWidthClasses[width]} ${cardHeightClasses[width]} group relative isolate overflow-hidden rounded-lg bg-accent text-secondary`}
  >
    <Image
      src={imageUrl}
      alt=""
      fill
      sizes={cardSizes[width]}
      className="z-[-2] object-cover transition duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 z-[-1] bg-accent/55 transition-colors duration-300 group-hover:bg-accent/45" />

    <div
      className={`${contentClasses[width]} absolute inset-0 flex flex-col gap-5 p-6 sm:p-5`}
    >
      <h3 className="max-w-sm text-xl leading-tight font-semibold">{text}</h3>

      <Link
        href={link}
        aria-label={`Детальніше: ${text}`}
        className="group/button relative inline-flex min-w-36 items-center justify-center overflow-hidden rounded-md px-5 py-3 text-sm font-semibold uppercase text-secondary border-2 ring-1 ring-secondary/35"
      >
        <span className="transition duration-300 ease-out group-hover/button:translate-x-10 group-hover/button:opacity-0 group-focus-visible/button:-translate-x-8 group-focus-visible/button:opacity-0">
          Детальніше
        </span>
        <span
          aria-hidden="true"
          className="absolute -translate-x-14 opacity-0 transition duration-300 ease-out group-hover/button:translate-x-0 group-hover/button:opacity-100 group-focus-visible/button:translate-x-0 group-focus-visible/button:opacity-100"
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
      </Link>
    </div>
  </article>
);

export default AboutSectionCard;
