import ContactCard, {
  type ContactCardProps,
} from "@/src/components/ContactCard";

type ContactOffice = ContactCardProps & {
  id: number;
};

const contactOffices: ContactOffice[] = [
  {
    id: 1,
    city: "Одеса",
    description: "Головний офіс",
    address: "Пр-т Шевченка,1, м. Одеса, 65020",
    phone: "+38 (048) 790 01 10",
    phoneHref: "tel:+380487900110",
    email: "office@soyuz-corp.com.ua",
    emailHref: "mailto:office@soyuz-corp.com.ua",
  },
  {
    id: 2,
    city: "Київ",
    description: "Представництво",
    address: "Вул. Костянтинівська, 2-А, м. Київ, 04071, БЦ «Контрактовий», 3-й поверх",
    phone: null,
    phoneHref: null,
    email: "office-kiev@soyuz-corp.com.ua",
    emailHref: "mailto:office-kiev@soyuz-corp.com.ua",
  },
];

const Contacts = () => (
  <section>
    <div className="mx-auto grid page-container content-page grid-cols-1 gap-8 md:grid-cols-2 md:justify-between xl:gap-64">
      {contactOffices.map((office: ContactOffice) => (
        <ContactCard
          key={office.id}
          city={office.city}
          description={office.description}
          address={office.address}
          phone={office.phone}
          phoneHref={office.phoneHref}
          email={office.email}
          emailHref={office.emailHref}
        />
      ))}
    </div>
  </section>
);

export default Contacts;
