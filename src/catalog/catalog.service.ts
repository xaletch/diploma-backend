import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CatalogService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCatalog() {
    const companies = await this.prismaService.company.findMany({
      take: 2,
      skip: 0,
      where: {},
      select: {
        id: true,
        name: true,
        publicName: true,
        specialization: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
          },
        },
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return companies;
  }
}
