
import Image from "next/image";
import Link from "next/link";

const AboutIntro = () => (
  <section className="sm:py-16">
    <div className="page-container grid gap-6 rounded-lg p-4 text-accent lg:grid-cols-[minmax(0,1.7fr)_minmax(22rem,1fr)] lg:items-stretch">
      <div className="relative min-h-[22rem] overflow-hidden rounded-md sm:min-h-[30rem] lg:h-full lg:min-h-0">
        <Image
          src="/previews/about-intro.jpg"
          alt="Енергетичний об'єкт корпорації Союз"
          fill
          sizes="(max-width: 1024px) calc(100vw - 4rem), 62vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-8 px-1 py-1 sm:px-2 lg:px-0">
        <div className="space-y-8 ">
          <p>
            <strong className="font-bold">
              Корпорація виробничих та комерційних підприємств «Союз»
              (Корпорація «Союз»)
            </strong>{" "}
            - колектив фахівців, який здатен виконати задачі будь-якої
            складності в енергетичній галузі.
          </p>

          <p>
            <strong className="font-bold">1991 рік, м. Одеса.</strong> Саме з
            цього року та з цього міста починається історія нашої компанії -
            історія професійного, якісного та персонального зростання. Наша
            компанія спеціалізується на виконанні проєктів «під ключ» в
            енергетиці й промисловості та пропонує своїм Замовникам комплексні
            рішення з побудови єдиних систем енергозабезпечення підприємств, що
            включають реконструкцію і будівництво нових потужностей і всієї
            необхідної енергетичної інфраструктури.
          </p>
        </div>

        <Link
          href="/about"
          aria-label="Детальніше про компанію"
          className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-md bg-accent px-5 py-3 text-lg font-medium text-secondary ring-1 ring-secondary/35"
        >
          <span className="transition duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:-translate-x-8 group-focus-visible:opacity-0">
            Детальніше
          </span>
          <span
            aria-hidden="true"
            className="absolute -translate-x-14 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  </section>
);

export default AboutIntro;
