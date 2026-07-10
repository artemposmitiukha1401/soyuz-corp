"use client";

import Image from "next/image";
import Link from "next/link";

type FooterLink = {
  id: number;
  label: string;
  href: string;
};

type FooterContact = {
  id: number;
  label: string;
  href: string;
};

const footerLinks: FooterLink[] = [
  {
    id: 1,
    label: "Про компанію",
    href: "/about",
  },
  {
    id: 2,
    label: "Послуги",
    href: "/services",
  },
  {
    id: 3,
    label: "Проєкти",
    href: "/projects",
  },
  {
    id: 4,
    label: "Медіа",
    href: "/media",
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

const footerContacts: FooterContact[] = [
  {
    id: 1,
    label: "м. Одеса, пр-т Шевченка, 1",
    href: "https://maps.google.com/?q=Одеса проспект Шевченка 1",
  },
  {
    id: 2,
    label: "+38 (048) 790 01 10",
    href: "tel:+380487900110",
  },
  {
    id: 3,
    label: "office@soyuz-corp.com.ua",
    href: "mailto:office@soyuz-corp.com.ua",
  },
];

const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-accent text-secondary">
      <div className="page-container grid justify-items-center gap-12 py-14 text-center sm:py-14 lg:grid-cols-[minmax(14rem,1fr)_minmax(16rem,1fr)] lg:items-start lg:justify-items-stretch lg:text-left">
        <nav className="flex w-fit flex-col items-center gap-1 text-base font-medium lg:items-start lg:justify-self-start">
          {footerLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="liquid-glass-hover w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-10 lg:items-end lg:justify-self-end">
          <Link href="\">
            <Image
              src="/logo.svg"
              alt="Корпорація Союз"
              width={1832}
              height={341}
              className="h-auto w-48 sm:w-56"
            />
          </Link>

          <address className="flex w-fit flex-col items-center gap-1 text-base font-medium lg:items-end lg:text-right">
            {footerContacts.map((contact) => (
              <Link
                key={contact.id}
                href={contact.href}
                className="liquid-glass-hover w-full"
              >
                {contact.label}
              </Link>
            ))}
          </address>
        </div>
      </div>

      <p className="page-container pb-9 text-center text-base text-secondary/75">
        © {currentYear} «СОЮЗ» являється зареєстрованою торговою маркою. Всі
        права захищено
      </p>
    </footer>
  );
};

export default Footer;
