import Image from "next/image";

type PageTitleGeneratorProps = {
  text: string;
  imageUrl: string;
};

const PageTitleGenerator = ({ text, imageUrl }: PageTitleGeneratorProps) => (
  <section className="relative isolate h-[min(30rem,40svh)] overflow-hidden bg-accent text-secondary">
    <Image
      src={imageUrl}
      alt=""
      fill
      priority
      sizes="100vw"
      className="z-[-2] object-cover object-center"
    />
    <div className="absolute inset-0 z-[-1] bg-accent/50" />

    <div className="page-container flex h-full items-center justify-center">
      <h1 className="max-w-5xl text-center text-[clamp(2.75rem,6vw,4rem)] leading-none font-semibold text-secondary uppercase">
        {text}
      </h1>
    </div>
  </section>
);

export default PageTitleGenerator;
