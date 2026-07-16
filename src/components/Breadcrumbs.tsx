"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routeConfig } from "@/src/config/routes";
import { useProjectBreadcrumbTitle } from "@/src/components/BreadcrumbProjectTitle";

const fallbackRouteLabels: Record<string, string> = {
  about: "Про компанію",
  projects: "Проєкти",
  services: "Послуги",
  media: "Медіа",
  partners: "Партнери",
  contacts: "Контакти",
  career: "Кар'єра",
};

const Breadcrumbs = () => {
  const pathname: string = usePathname();
  const projectTitle: string | null = useProjectBreadcrumbTitle();
  const segments: string[] = pathname.split("/").filter(Boolean);
  const isProjectDetail: boolean = segments[0] === "projects" && segments.length > 1;

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumbs"
      className={`pointer-events-none absolute inset-x-0 top-0 z-40 w-full py-3 text-sm text-secondary shadow-sm ${
        isProjectDetail ? "bg-accent" : "bg-accent/40 backdrop-blur-md"
      }`}
    >
      <ol className="page-container pointer-events-auto flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition hover:text-secondary/70">
            Головна
          </Link>
        </li>

        {segments.map((segment: string, index: number) => {
          const href: string = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast: boolean = index === segments.length - 1;
          const defaultLabel: string =
            routeConfig[href]?.label ?? fallbackRouteLabels[segment] ?? segment;
          const isProjectBreadcrumb: boolean = isProjectDetail && index === 1;
          const label: string = isProjectBreadcrumb && projectTitle !== null ? projectTitle : defaultLabel;

          return (
            <li key={href} className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className="text-white/45">
                |
              </span>

              {isLast ? (
                <span
                  className="block max-w-52 truncate font-medium sm:max-w-96"
                  title={label}
                >
                  {label}
                </span>
              ) : (
                <Link href={href} className="transition hover:text-secondary/70">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
