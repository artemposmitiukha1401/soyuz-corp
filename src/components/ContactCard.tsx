export type ContactCardProps = {
  city: string;
  description: string;
  address: string;
  phone: string | null;
  phoneHref: string | null;
  email: string;
  emailHref: string;
};

const ContactCard = ({
  city,
  description,
  address,
  phone,
  phoneHref,
  email,
  emailHref,
}: ContactCardProps) => (
  <article className="flex min-h-60 flex-col rounded-md bg-accent p-4 text-secondary sm:p-6">
    <address className="grid h-full grid-rows-[minmax(6rem,auto)_auto_1fr] gap-5 text-[clamp(1rem,2vw,1rem)] leading-[1.08] font-normal not-italic align-top">
      <div className="flex flex-col gap-3 h-min">
        <h2 className="text-[clamp(1.2rem,2vw,1.2rem)] leading-[1.05] font-bold">
          {city}
          <br />
          ({description})
        </h2>

        <p className="max-w-[28rem] font-medium text-secondary">{address}</p>
      </div>

      <div aria-hidden="true" className="h-px w-full bg-secondary" />

      <div className="flex flex-col justify-start gap-5">
        {phone && phoneHref ? (
          <a href={phoneHref} className="w-fit">
            {phone}
          </a>
        ) : null}

        <a href={emailHref} className="w-fit">
          {email}
        </a>
      </div>
    </address>
  </article>
);

export default ContactCard;
