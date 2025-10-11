import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ServiceCreateDto } from "./dto/service.dto";
import { CompanyService } from "src/company/company.service";

@Injectable()
export class ServicesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly companyService: CompanyService,
  ) {}

  async getAll(company_id: string) {
    const services = await this.prismaService.service.findMany({
      where: { companyId: company_id },
      select: {
        id: true,
        name: true,
        duration: true,
        price: {
          select: {
            id: true,
            price: true,
            costPrice: true,
            discount: {
              select: {
                id: true,
                dateType: true,
                days: true,
                price: true,
                timeStart: true,
                timeEnd: true,
              },
            },
          },
        },
        publicName: true,
      },
    });

    if (!services) throw new NotFoundException("Услуги не найдены");

    return services;
  }

  async create(dto: ServiceCreateDto, company_id: string) {
    await this.companyService.findById(company_id);
    return { dto, company_id };
  }
}
