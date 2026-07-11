import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProject,
  getProjectImageUrl,
  type ProjectDetail,
  type ProjectImage,
} from "@/src/lib/projects-api";

type ProjectsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

const renderDescriptionParagraphs = (description: string): string[] => {
  return description
    .split("\n")
    .map((paragraph: string) => paragraph.trim())
    .filter((paragraph: string) => paragraph.length > 0);
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
    <section>
      <article className="page-container">
        <Link className="mb-8 inline-block font-semibold text-accent" href="/projects">
          Назад до проєктів
        </Link>

        <div className="rounded-lg bg-accent p-5 text-white md:p-8">
          <img
            src={getProjectImageUrl(project.coverImageUrl)}
            alt={project.title}
            className="aspect-[16/9] w-full rounded-md object-cover opacity-75"
          />

          <h1 className="mt-7 text-3xl font-bold uppercase leading-tight">
            {project.title}
          </h1>

          <dl className="mt-8 grid grid-cols-[minmax(8rem,13rem)_1fr] gap-x-6 gap-y-6">
            {projectRows(project).map((row: { label: string; value: string }) => (
              <div key={row.label} className="contents">
                <dt className="text-xl font-bold leading-tight">{row.label}</dt>
                <dd className="text-xl font-normal leading-tight">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 max-w-4xl">
          <h2 className="text-3xl font-bold text-accent">Опис проєкту</h2>
          <div className="mt-5 space-y-5">
            {renderDescriptionParagraphs(project.fullDescription).map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        {project.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-accent">Галерея</h2>
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
  );
}
