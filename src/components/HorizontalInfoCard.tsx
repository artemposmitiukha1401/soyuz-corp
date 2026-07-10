import Image from "next/image";

export type HorizontalInfoCardObject = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  items: string[];
};

export type HorizontalInfoCardProps = HorizontalInfoCardObject;

const HorizontalInfoCard = ({
  imageUrl,
  imageAlt,
  title,
  description,
  items,
}: HorizontalInfoCardProps) => (
  <article className="grid gap-6 border-b-2  border-accent pb-10 text-accent last:border-b-0 last:pb-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-stretch">
    <div className="relative min-h-[20rem] overflow-hidden rounded-md sm:min-h-[20rem] lg:h-full lg:min-h-0">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 1024px) calc(100vw - 2rem), 42vw"
        className="object-cover object-center"
      />
    </div>

    <div className="flex flex-col gap-7 lg:pt-1">
      <h2 className="text-[clamp(1.5rem,2vw,1.75rem)] leading-[1.05] font-semibold">
        {title}
      </h2>

      <div className="space-y-7 font-normal">
        <p className="text-[inherit]">{description}</p>

        <ul className="list-disc text-[clamp(1.05rem,2vw,1.05rem)] leading-[1.45] space-y-2 pl-4 marker:text-accent">
          {items.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </article>
);

export default HorizontalInfoCard;
