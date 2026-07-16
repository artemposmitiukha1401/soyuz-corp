import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProject,
  getProjectImageUrl,
  type ProjectDetail,
  type ProjectImage,
} from "@/src/lib/projects-api";
import { ProjectBreadcrumbTitle } from "@/src/components/BreadcrumbProjectTitle";

type ProjectsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const projectPreviewFallbackUrl: string = "/logo.svg";

const projectRows = (project: ProjectDetail): { label: string; value: string }[] => [
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

const normalizeDescription = (description: string): string => {
  return description.replace(/\s+/g, " ").trim();
};

export default async function ProjectDetailPage({ params }: ProjectsDetailPageProps) {
  const { slug } = await params;
  let project: ProjectDetail;

  try {
    project = await getProject(slug);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("status=404")) {
      notFound();
    }

    throw error;
  }

  return (
    <>
      <ProjectBreadcrumbTitle title={project.title} />
      <section>
        <article className="page-container">
        <Link
          href="/projects"
          className="group relative mb-8 inline-flex w-full items-center justify-center overflow-hidden rounded-md bg-accent px-5 py-3 text-lg font-medium text-secondary ring-1 ring-secondary/35 sm:w-auto"
        >
          <span className="transition duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:-translate-x-8 group-focus-visible:opacity-0">
            Назад до проєктів
          </span>
          <span
            aria-hidden="true"
            className="absolute -translate-x-14 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>

        <div className="border-b-2  border-accent pb-7 text-accent ">
          {project.coverImageUrl !== null ? (
            <img
              src={getProjectImageUrl(project.coverImageUrl)}
              alt={project.title}
              className="aspect-[16/9] w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md bg-accent p-12">
              <Image
                src={projectPreviewFallbackUrl}
                alt="Корпорація Союз"
                width={320}
                height={120}
                className="h-auto w-3/5 max-w-sm"
              />
            </div>
          )}

          <h1 className="mt-7 text-[clamp(1.5rem,2vw,1.75rem)] font-semibold uppercase leading-tight">
            {project.title}
          </h1>

          <dl className="mt-8 grid grid-cols-[minmax(8rem,13rem)_1fr] gap-x-6 gap-y-6">
            {projectRows(project).map((row: { label: string; value: string }) => (
              <div key={row.label} className="contents">
                <dt className="text-[clamp(1.05rem,2vw,1.05rem)] font-semibold leading-tight">{row.label}</dt>
                <dd className="text-[clamp(1.05rem,2vw,1.05rem)] font-normal leading-tight">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12">
          <h2 className="text-[clamp(1.5rem,2vw,1.75rem)] font-semibold text-accent">Опис проєкту</h2>
          <p className="mt-5 text-accent">{normalizeDescription(project.fullDescription)}</p>
        </div>

        {project.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[clamp(1.5rem,2vw,1.75rem)] font-semibold text-accent">Галерея</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {project.images.map((image: ProjectImage) => (
                <img
                  key={image.id}
                  src={getProjectImageUrl(image.imageUrl)}
                  alt={image.altText}
                  className="aspect-video w-full rounded-md object-cover"
                />
              ))}
            </div>
          </div>
        )}
        </article>
      </section>
    </>
  );
}
