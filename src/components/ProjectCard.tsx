import Image from "next/image";
import Link from "next/link";

import {
  getProjectImageUrl,
  type ProjectCard as ProjectCardData,
} from "@/src/lib/projects-api";

type ProjectCardProps = {
  project: ProjectCardData;
};

type ProjectCardRow = {
  label: string;
  value: string;
};

const projectPreviewFallbackUrl: string = "/logo.svg";

const createProjectRows = (project: ProjectCardData): ProjectCardRow[] => [
  {
    label: "Замовник:",
    value: project.customer,
  },
  {
    label: "Предмет контракту:",
    value: project.contractSubject,
  },
  {
    label: "Галузь:",
    value: project.industry,
  },
  {
    label: "Територія:",
    value: project.territory,
  },
  {
    label: "Термін реалізації проекту:",
    value: `${project.startYear}-${project.endYear}`,
  },
];

const ProjectCard = ({ project }: ProjectCardProps) => {
  const rows: ProjectCardRow[] = createProjectRows(project);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-md border-3 text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        {project.coverImageUrl !== null ? (
          <img
            src={getProjectImageUrl(project.coverImageUrl)}
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-105 group-hover:blur-sm group-focus-visible:scale-105 group-focus-visible:blur-sm"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent p-10 transition duration-300 ease-out group-hover:scale-105 group-hover:blur-sm group-focus-visible:scale-105 group-focus-visible:blur-sm">
            <Image
              src={projectPreviewFallbackUrl}
              alt="Корпорація Союз"
              width={320}
              height={120}
              className="h-auto w-3/5 max-w-xs"
            />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-accent/10 opacity-0 backdrop-blur-none transition duration-300 ease-out group-hover:opacity-100 group-hover:backdrop-blur-sm group-focus-visible:opacity-100 group-focus-visible:backdrop-blur-sm">
          <span
            aria-hidden="true"
            className=" inline-flex size-30 -translate-x-14 items-center justify-center rounded-full text-secondary opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            <svg
              width="86"
              height="86"
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
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-[clamp(1.5rem,2vw,1.75rem)] font-semibold leading-tight">
          {project.title}
        </h2>

        <dl className="mt-7 grid grid-cols-[minmax(8rem,13rem)_1fr] gap-x-6 gap-y-6">
          {rows.map((row: ProjectCardRow) => (
            <div key={row.label} className="contents">
              <dt className="text-[clamp(1.05rem,2vw,1.05rem)] font-semibold leading-tight">{row.label}</dt>
              <dd className="text-[clamp(1.05rem,2vw,1.05rem)] font-normal leading-tight">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  );
};

export default ProjectCard;
