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
      className="block overflow-hidden rounded-md border-3 text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <img
        src={getProjectImageUrl(project.coverImageUrl)}
        alt={project.title}
        className="aspect-[16/11] w-full object-cover opacity-75"
      />

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
