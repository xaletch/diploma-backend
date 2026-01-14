import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const permissions = [
  "service:create",
  "service:update",
  "service:delete",
  "service-users:update",
  "service-locations:update",
  "service-category:create",
  "service-category:delete",
  "schedule:create",
  "schedule:all",
  "schedule:first",
  "schedule:update",
  "schedule:delete",
  "location:create",
  "locations:read",
  "location:read",
  "location:update",
  "location:users",
  "location:user",
  "location:delete",
  "employee:invite",
  "employee/register",
  "employee:update",
  "employee:delete",
  "employees:read",
  "company-customer:create",
  "company:create",
  "booking:create",
  "bookings:read",
  "booking-detail:read",
  "booking:update",
  "booking:status",
  "booking:delete",
];

const specializations = [
  {
    name: "Красота",
    description:
      "Для салонов красоты, парикмахерских и косметологических служб.",
    icon: "http://localhost:8080/v1/assets/specialization/specialization-services.svg",
    industries: [
      "Парикмахерская",
      "Салон красоты",
      "Студия эпиляции",
      "Электроэпиляция",
      "Салон лазерной эпиляции",
      "Массажная студия",
      "Маникюрный салон",
      "Спа-салон",
      "Студия загара",
      "Тату-салон",
    ],
  },
  {
    name: "Спорт",
    description: "Для тренажерных залов, студий йоги и фитнес-центров.",
    icon: "http://localhost:8080/v1/assets/specialization/specialization-sport.svg",
    industries: [
      "Аэройога",
      "Центр кроссфита",
      "Танцевальная студия",
      "Фитнес-центр",
      "Гольф-клуб",
      "Тренажерный зал",
      "Персональный тренер",
      "Школа катания на роликах",
      "Спортивный центр",
      "Спортивный клуб",
      "Студия растяжки",
      "Студия йоги",
      "Теннисный корт",
    ],
  },
  {
    name: "Услуга",
    description: "Для тренажерных залов, студий йоги и фитнес-центров.",
    icon: "http://localhost:8080/v1/assets/specialization/specialization-services.svg",
    industries: [
      "Бизнес-консалтинг",
      "Уборка",
      "Юридический центр",
      "Юридическая консультация",
      "Нотариус",
      "Фотограф",
      "Агентство недвижимости",
      "Студия звукозаписи",
      "Ремонтная мастерская",
      "Свадебный салон",
      "Видеостудия",
    ],
  },
  {
    name: "Развлечение",
    description:
      "Для клубов виртуальной реальности, комнат отдыха и других мероприятий.",
    icon: "http://localhost:8080/v1/assets/specialization/specialization-entertainment.svg",
    industries: [
      "Антистрессовая комната",
      "Прыжки с парашютом в помещении",
      "Баня",
      "Сауна",
      "Бильярд",
      "Боулинг",
      "Центр скалолазания",
      "Картинг",
      "Пейнтбол",
      "Лазертаг",
      "Игровой центр",
      "Бассейн",
      "Квест",
      "Зона отдыха",
      "VR Клуб",
      "Компьютерный клуб",
    ],
  },
  {
    name: "Животные",
    description:
      "Для ветеринарных клиник, груминговых салонов и служб по уходу за домашними животными.",
    icon: "http://localhost:8080/v1/assets/specialization/specialization-animals.svg",
    industries: [
      "Дрессировка животных",
      "Зоосалон",
      "Ветеринарная клиника",
      "Другое",
    ],
  },
  {
    name: "Аренда",
    description: "Для фотостудий, коворкингов и мест проведения мероприятий.",
    icon: "http://localhost:8080/v1/assets/specialization/specialization-rent.svg",
    industries: [
      "Банкетный зал",
      "Коворкинг",
      "Творческое пространство",
      "Чердак",
      "Подвал",
      "Офис",
      "Аренда",
      "Выставочный зал",
      "Другое",
    ],
  },
  {
    name: "Авто",
    description: "Для автосервисов, автосалонов и моечных станций.",
    icon: "http://localhost:8080/v1/assets/specialization/specialization-auto.svg",
    industries: [
      "Автосервис",
      "Автосалон",
      "Автомойка",
      "Станция технического обслуживания",
      "Тюнинг-мастерская",
      "Шиномонтаж",
      "Другое",
    ],
  },
];

const main = async () => {
  try {
    await prisma.role.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.specialization.deleteMany();

    for (const spec of specializations) {
      const specialization = await prisma.specialization.create({
        data: {
          name: spec.name,
          description: spec.description,
          icon: spec.icon,
        },
      });

      await prisma.industry.createMany({
        data: spec.industries.map((name: string) => ({
          name,
          specializationId: specialization.id,
        })),
      });
    }

    await prisma.role.createMany({
      data: [{ name: "owner" }, { name: "employee" }],
    });

    for (const name of permissions) {
      await prisma.permission.create({ data: { name } });
    }
    const owner = await prisma.role.findFirst({
      where: { name: "owner" },
      select: { id: true },
    });
    const allPermissions = await prisma.permission.findMany();

    await prisma.role.update({
      where: { id: owner!.id },
      data: {
        permissions: {
          connect: allPermissions.map((p: { id: number }) => ({ id: p.id })),
        },
      },
    });

    console.log("🚀 Database has been seeded.");
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
