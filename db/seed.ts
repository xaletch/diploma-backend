import { PrismaClient } from "@prisma/client";
import { permissions } from "./arr/permission.data";
import { specializations } from "./arr/specializations.data";

const prisma = new PrismaClient();

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
        data: spec.industries.map((name) => ({
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
          connect: allPermissions.map((p) => ({ id: p.id })),
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
