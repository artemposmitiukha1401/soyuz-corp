import { createPageMetadata } from "@/src/lib/page-metadata";

export const metadata = createPageMetadata("Кар'єра");

type CareerSpecialist = {
  id: number;
  title: string;
};

const careerSpecialists: CareerSpecialist[] = [
  {
    id: 1,
    title: "Менеджер проекту",
  },
  {
    id: 2,
    title: "Інженер технагляду",
  },
  {
    id: 3,
    title: "Електромонтажник силових мереж і устаткування",
  },
  {
    id: 4,
    title: "Слюсар зі складання металоконструкцій",
  },
  {
    id: 5,
    title: "Електромонтер-лінійник",
  },
  {
    id: 6,
    title: "Екскаваторник",
  },
];

const Career = () => (
  <section>
    <div className="page-container grid gap-7 text-accent">
      <p>
        Корпорація «СОЮЗ» надає реальні можливості професійного і кар&apos;єрного
        зростання для цілеспрямованих, ініціативних людей, які мають досвід
        роботи і вміють працювати в колективі. Приєднуйся до команди
        професіоналів!{" "}
        <strong className="font-semibold">Сильні - тому що разом!</strong>
      </p>

      <article>
        <h2 className="mb-4 text-[clamp(1.5rem,2vw,1.75rem)] leading-snug font-semibold">
          Потрібні спеціалісти:
        </h2>

        <ul className="list-disc space-y-2 pl-5 text-[clamp(1.05rem,2vw,1.05rem)] leading-relaxed marker:text-accent">
          {careerSpecialists.map((specialist: CareerSpecialist) => (
            <li key={specialist.id}>{specialist.title}</li>
          ))}
        </ul>
      </article>

      <div className="grid gap-4 text-[clamp(1.05rem,2vw,1.05rem)] leading-relaxed">
        <p className="font-semibold">Направляйте Ваше резюме:</p>

        <a href="mailto:office@soyuz-corp.com.ua" className="w-fit">
          office@soyuz-corp.com.ua
        </a>
      </div>
    </div>
  </section>
);

export default Career;
