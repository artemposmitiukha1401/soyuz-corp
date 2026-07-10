type CommissioningTextItem = {
  id: number;
  text: string;
};

const projectStages: CommissioningTextItem[] = [
  {
    id: 1,
    text: "збір вихідних даних",
  },
  {
    id: 2,
    text: "розробку концепції",
  },
  {
    id: 3,
    text: "узгодження з Замовником",
  },
  {
    id: 4,
    text: "експертизу",
  },
];

const designExperience: CommissioningTextItem[] = [
  {
    id: 1,
    text: "Досвід проєктування складних та відповідальних об’єктів",
  },
  {
    id: 2,
    text: "впровадження передових програм і технологій",
  },
  {
    id: 3,
    text: "співробітництво з ведучими виробниками енергетичного обладнання",
  },
];

const networkCalculations: CommissioningTextItem[] = [
  {
    id: 1,
    text: "Аналіз перспективних планів розвитку мереж",
  },
  {
    id: 2,
    text: "розрахунки їх статичної та динамічної стійкості",
  },
  {
    id: 3,
    text: "розрахунки аварійно-ремонтних режимів і струмів короткого замикання",
  },
];

const bimResults: CommissioningTextItem[] = [
  {
    id: 1,
    text: "отримати не тільки повну візуалізацію об’єкту з поетапним планом будівництва",
  },
  {
    id: 2,
    text: "скоротити час розробки проєктної документації",
  },
  {
    id: 3,
    text: "мінімізувати різницю між плановими і фактичними витратами при будівництві",
  },
];

const Commissioning = () => (
  <section className="page-container">
    <div className="grid gap-8 text-accent">
      <p className="font-semibold">
        Корпорація «Союз» розробляє проєктування «під ключ» - від розрахунків
        ТЕО, розробки всіх розділів проєктної документації до авторського
        нагляду при будівництві.
      </p>

      <div>
        <p className="mb-3">Етапи проєктування включають:</p>

        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          {projectStages.map((stage: CommissioningTextItem) => (
            <li key={stage.id}>{stage.text}</li>
          ))}
        </ul>
      </div>

      <p>
        Система контролю якості проектування здійснюється за міжнародними
        стандартами і підтверджена сертифікатом ISO 9001:2015.
      </p>

      <div>
        <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-accent">
          {designExperience.map((item: CommissioningTextItem) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>

        <p>
          все це дозволяє нам оперативно трансформувати складні задачі в
          оптимальні рішення. Розробляючи проєкти, ми своєчасно реагуємо на
          зміни у сфері будівництва та енергозабезпечення.
        </p>
      </div>

      <div>
        <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-accent">
          {networkCalculations.map((calculation: CommissioningTextItem) => (
            <li key={calculation.id}>{calculation.text}</li>
          ))}
        </ul>

        <p>
          дають нам можливість з високою точністю визначити параметри основного
          обладнання, забезпечити необхідну комплектацію та оптимальну вартість
          об’єктів Замовника. Додатково, ми здійснюємо усі необхідні розрахунки
          і розробляємо заходи, щоб гарантувати необхідну якість електроенергії
          відповідно до регіональних стандартів.
        </p>
      </div>

      <p>
        Впровадження сучасних технологій проектування дозволило нам здійснити
        процес більш наглядним та динамічним. Технологія ВІМ-моделювання
        дозволяє:
      </p>

      <ul className="list-disc space-y-2 pl-5 marker:text-accent">
        {bimResults.map((result: CommissioningTextItem) => (
          <li key={result.id}>{result.text}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default Commissioning;
