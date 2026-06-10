import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

async function main() {
  const [users, locations, customers] = await Promise.all([
    prisma.user.findMany({ select: { id: true, phone: true } }),
    prisma.location.findMany({ select: { id: true, phone: true } }),
    prisma.customer.findMany({ select: { id: true, phone: true } }),
  ]);

  await Promise.all([
    ...users.map((u) =>
      prisma.user.update({
        where: { id: u.id },
        data: { phoneNormalized: normalizePhone(u.phone) },
      }),
    ),
    ...locations.map((l) =>
      prisma.location.update({
        where: { id: l.id },
        data: { phoneNormalized: l.phone ? normalizePhone(l.phone) : null },
      }),
    ),
    ...customers.map((c) =>
      prisma.customer.update({
        where: { id: c.id },
        data: { phoneNormalized: normalizePhone(c.phone) },
      }),
    ),
  ]);

  console.log(
    `Обновлены: ${users.length} сотрудников, ${locations.length} локаций, ${customers.length} клиентов`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
