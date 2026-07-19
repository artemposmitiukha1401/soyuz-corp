type PageTitleGeneratorProps = {
  text: string;
  imageUrl: string;
};

const PageTitleGenerator = ({ text, imageUrl }: PageTitleGeneratorProps) => (
  <section className="relative isolate h-[min(30rem,40svh)] overflow-hidden bg-accent text-secondary">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={imageUrl}
      alt=""
      fetchPriority="high"
      className="absolute inset-0 z-[-2] h-full w-full object-cover object-center"
    />
    <div className="absolute inset-0 z-[-1] bg-accent/50" />

    <div className="page-container flex h-full min-w-0 items-center justify-center px-4">
      <h1 className="max-w-full break-words text-center text-[clamp(1.75rem,8vw,4rem)] leading-[1.05] font-semibold text-balance text-secondary uppercase sm:text-[clamp(2.2rem,6vw,4rem)]">
        {text}
      </h1>
    </div>
  </section>
);

export default PageTitleGenerator;
