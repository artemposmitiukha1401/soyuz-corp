"use client";

import Image from "next/image";
import Link from "next/link";
import { type FocusEvent, useState } from "react";

type HeaderLink = {
  id: number;
  label: string;
  href: string;
};

type HeaderDropdownLink = HeaderLink;

type HeaderNavigationItem = HeaderLink & {
  children?: HeaderDropdownLink[];
};

const aboutDropdownLinks: HeaderDropdownLink[] = [
  {
    id: 1,
    label: "Наша компанія",
    href: "/about/our-company",
  },
  {
    id: 2,
    label: "Географія великих проєктів",
    href: "/about/projects-geography",
  },
  {
    id: 3,
    label: "Замовники та партнери",
    href: "/about/cooperation",
  },
  {
    id: 4,
    label: "Захищаємо та відновлюємо",
    href: "/about/protect-and-restore",
  },
  {
    id: 5,
    label: "Антикорупційний комплаєнс",
    href: "/about/anti-corruption-compliance",
  },
  {
    id: 6,
    label: "Звітність",
    href: "/about/reporting",
  },
  {
    id: 7,
    label: "Наближаємо перемогу",
    href: "/about/reaching-win",
  },
  {
    id: 8,
    label: "Наші досягнення",
    href: "/about/achievements",
  },
  {
    id: 9,
    label: "Наші контакти",
    href: "/about/contacts",
  },
];

const serviceDropdownLinks: HeaderDropdownLink[] = [
  {
    id: 1,
    label: "Департамент альтернативної енергетики",
    href: "/divisions/alternative-energy",
  },
  {
    id: 2,
    label: 'Бізнес-дивізіон "Генерація"',
    href: "/divisions/generation",
  },
  {
    id: 3,
    label: 'Бізнес-дивізіон "Мережі"',
    href: "/divisions/networks",
  },
  {
    id: 4,
    label: "Проєктування",
    href: "/divisions/commissioning",
  },
  
];

const projectDropdownLinks: HeaderDropdownLink[] = [
  {
    id: 1,
    label: "Усі проєкти",
    href: "/projects?filter=all&page=1",
  },
  {
    id: 2,
    label: "Великі проєкти",
    href: "/projects?filter=big&page=1",
  },
  {
    id: 3,
    label: "Завершені проєкти",
    href: "/projects?filter=finished&page=1",
  },
];

const links: HeaderNavigationItem[] = [
  {
    id: 1,
    label: "Про компанію",
    href: "/about",
    children: aboutDropdownLinks,
  },
  {
    id: 2,
    label: "Послуги",
    href: "/divisions",
    children: serviceDropdownLinks,
  },
  {
    id: 3,
    label: "Проєкти",
    href: "/projects",
    children: projectDropdownLinks,
  },
  {
    id: 4,
    label: "Медіа",
    href: "/gallery",
  },
  {
    id: 5,
    label: "Контакти",
    href: "/contacts",
  },
  {
    id: 6,
    label: "Кар'єра",
    href: "/career",
  },
];

const dropdownLinkAnimationClasses: string[] = [
  "delay-50",
  "delay-100",
  "delay-150",
  "delay-200",
  "delay-250",
  "delay-300",
  "delay-350",
  "delay-400",
  "delay-450",
];

const Header = () => {
  const [openDesktopGroupId, setOpenDesktopGroupId] = useState<number | null>(
    null,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openMobileGroupId, setOpenMobileGroupId] = useState<number | null>(null);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen((currentIsOpen: boolean) => !currentIsOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
    setOpenMobileGroupId(null);
  };

  const closeDesktopMenu = (): void => {
    setOpenDesktopGroupId(null);
  };

  const closeNavigationMenus = (): void => {
    closeDesktopMenu();
    closeMobileMenu();
  };

  const toggleMobileGroup = (id: number): void => {
    setOpenMobileGroupId((currentId: number | null) =>
      currentId === id ? null : id,
    );
  };

  const handleDesktopGroupBlur = (
    event: FocusEvent<HTMLDivElement>,
  ): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closeDesktopMenu();
    }
  };

  return (
    <header className="relative z-50 w-full bg-accent text-secondary">
      <div className="page-container flex min-h-22 items-center justify-between gap-6 py-3 lg:min-h-26 lg:py-0">
        <Link href="/" onClick={closeMobileMenu}>
          <Image
            src="/logo.svg"
            height={120}
            width={120}
            className="w-40 sm:w-48 lg:w-55"
            alt="Corporate Logo"
          />
        </Link>

        <nav className="hidden flex-wrap items-center justify-end gap-x-5 gap-y-2 text-base font-medium lg:flex">
          {links.map((link: HeaderNavigationItem) =>
            link.children ? (
              <div
                key={link.id}
                className="relative"
                onMouseEnter={() => {
                  setOpenDesktopGroupId(link.id);
                }}
                onMouseLeave={closeDesktopMenu}
                onFocus={() => {
                  setOpenDesktopGroupId(link.id);
                }}
                onBlur={handleDesktopGroupBlur}
              >
                <Link
                  className="liquid-glass-hover inline-flex items-center gap-1.5"
                  href={link.href}
                  onClick={closeNavigationMenus}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`transition duration-300 ease-out ${openDesktopGroupId === link.id ? "rotate-180" : ""}`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>

                <div
                  className={`absolute left-0 top-full z-50 min-w-72 origin-top pt-3 transition duration-300 ease-out ${openDesktopGroupId === link.id ? "visible translate-y-0 scale-100 opacity-100" : "invisible scale-95 opacity-0"}`}
                >
                  <ul className="rounded-md border border-secondary/20 bg-accent/95 p-2 text-sm shadow-lg backdrop-blur-md transition duration-300 ease-out">
                    {link.children.map(
                      (childLink: HeaderDropdownLink, index: number) => (
                        <li
                          key={childLink.id}
                          className={`${dropdownLinkAnimationClasses[index]} transition duration-300 ease-out ${openDesktopGroupId === link.id ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                        >
                          <Link
                            href={childLink.href}
                            onClick={closeNavigationMenus}
                            className="block rounded-sm px-4 py-3 text-secondary transition hover:bg-secondary/10 focus-visible:bg-secondary/10 focus-visible:outline-none"
                          >
                            {childLink.label}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                className="liquid-glass-hover"
                key={link.id}
                href={link.href}
                onClick={closeNavigationMenus}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          className="liquid-glass-hover inline-flex size-12 items-center justify-center rounded-md lg:hidden"
        >
          <span className="sr-only">
            {isMobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
          </span>
          <span
            aria-hidden="true"
            className="relative flex h-5 w-8 flex-col justify-between"
          >
            <span
              className={`h-0.5 w-full rounded-full bg-current transition duration-300 ${isMobileMenuOpen ? "translate-y-[0.5625rem] rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition duration-300 ${isMobileMenuOpen ? "-translate-y-[0.5625rem] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`absolute inset-x-0 top-full border-t border-secondary/15 bg-accent shadow-lg transition duration-300 lg:hidden ${isMobileMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"}`}
      >
        <nav className="page-container flex max-h-[calc(100svh-5.5rem)] flex-col overflow-y-auto py-4 text-base font-medium">
          {links.map((link: HeaderNavigationItem) => {
            const isGroupOpen: boolean = openMobileGroupId === link.id;

            return link.children ? (
              <div key={link.id} className="border-b border-secondary/15 py-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="liquid-glass-hover min-h-12 flex-1 rounded-md px-3 py-3"
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      toggleMobileGroup(link.id);
                    }}
                    aria-label={`${isGroupOpen ? "Згорнути" : "Розгорнути"} ${link.label}`}
                    aria-expanded={isGroupOpen}
                    className="liquid-glass-hover inline-flex size-12 items-center justify-center rounded-md"
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition duration-300 ${isGroupOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  className={`grid transition duration-300 ${isGroupOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <ul className="min-h-0 overflow-hidden pl-4">
                    {link.children.map((childLink: HeaderDropdownLink) => (
                      <li key={childLink.id}>
                        <Link
                          href={childLink.href}
                          onClick={closeMobileMenu}
                          className="block rounded-md px-3 py-3 text-sm text-secondary/90 transition hover:bg-secondary/10 focus-visible:bg-secondary/10 focus-visible:outline-none"
                        >
                          {childLink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                className="liquid-glass-hover min-h-12 rounded-md px-3 py-3"
                key={link.id}
                href={link.href}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
