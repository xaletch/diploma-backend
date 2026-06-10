import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSettings() {
  const userSettings = await prisma.user.findMany({
    where: { settings: null },
  });

  for (const user of userSettings) {
    await prisma.settings.create({
      data: { userId: user.id },
    });
  }

  console.log(`Созданы настройки для ${userSettings.length} пользователей`);
}

createSettings()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
