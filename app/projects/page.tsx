import Link from "next/link";
import { notFound } from "next/navigation";

import ProjectCard from "@/src/components/ProjectCard";
import {
  getProjects,
  type ProjectCard as ProjectCardData,
  type ProjectFilter,
  type ProjectPage,
} from "@/src/lib/projects-api";

type ProjectsPageProps = {
  searchParams: Promise<{
    filter?: string | string[];
    page?: string | string[];
  }>;
};

const readPageNumber = (value: string | string[] | undefined): number | null => {
  if (value === undefined) {
    return 1;
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  return Number(value);
};

const readProjectFilter = (value: string | string[] | undefined): ProjectFilter | null => {
  if (value === undefined) {
    return "all";
  }

  if (value === "all" || value === "big" || value === "finished") {
    return value;
  }

  return null;
};

const createPageHref = (page: number, projectFilter: ProjectFilter): string => {
  return `/projects?filter=${projectFilter}&page=${page}`;
};

const projectFilters: { label: string; value: ProjectFilter }[] = [
  { label: "Усі", value: "all" },
  { label: "Великі", value: "big" },
  { label: "Завершені", value: "finished" },
];

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams: { filter?: string | string[]; page?: string | string[] } =
    await searchParams;
  const requestedPage: number | null = readPageNumber(resolvedSearchParams.page);
  const requestedFilter: ProjectFilter | null = readProjectFilter(resolvedSearchParams.filter);

  if (requestedPage === null || requestedFilter === null) {
    notFound();
  }

  let projectPage: ProjectPage;

  try {
    projectPage = await getProjects(requestedPage, requestedFilter);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("status=404")) {
      notFound();
    }

    throw error;
  }

  return (
    <section>
      <div className="page-container">
        <nav aria-label="Фільтр проєктів" className="mb-8 flex flex-wrap gap-2">
          {projectFilters.map(({ label, value }: { label: string; value: ProjectFilter }) =>
            value === requestedFilter ? (
              <span
                key={value}
                aria-current="page"
                className="rounded-md bg-accent px-4 py-2 font-semibold text-secondary"
              >
                {label}
              </span>
            ) : (
              <Link
                key={value}
                href={createPageHref(1, value)}
                className="rounded-md border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {label}
              </Link>
            ),
          )}
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {projectPage.items.map((project: ProjectCardData) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projectPage.totalPages > 1 && (
          <nav
            aria-label="Ð¡Ñ‚Ð¾Ñ€Ñ–Ð½ÐºÐ¸ Ð¿Ñ€Ð¾Ñ”ÐºÑ‚Ñ–Ð²"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {projectPage.page > 1 ? (
              <Link
                href={createPageHref(projectPage.page - 1, requestedFilter)}
                className="rounded-md border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Попередня
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="cursor-not-allowed rounded-md border border-accent/30 px-4 py-2 font-semibold text-accent/40"
              >
                Попередня
              </span>
            )}

            {Array.from({ length: projectPage.totalPages }, (_, index: number) => index + 1).map(
              (page: number) =>
                page === projectPage.page ? (
                  <span
                    key={page}
                    aria-current="page"
                    className="min-w-10 rounded-md bg-accent px-3 py-2 text-center font-semibold text-secondary"
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={createPageHref(page, requestedFilter)}
                    className="min-w-10 rounded-md border border-accent px-3 py-2 text-center font-semibold text-accent transition hover:bg-accent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {page}
                  </Link>
                ),
            )}

            {projectPage.page < projectPage.totalPages ? (
              <Link
                href={createPageHref(projectPage.page + 1, requestedFilter)}
                className="rounded-md border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Наступна
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="cursor-not-allowed rounded-md border border-accent/30 px-4 py-2 font-semibold text-accent/40"
              >
                Наступна
              </span>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
