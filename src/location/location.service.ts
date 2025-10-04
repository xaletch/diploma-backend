import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LocationDto } from "./dto/location.dto";

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: LocationDto, companyId: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new NotFoundException("Компания не найдена");

    const location = await this.prismaService.location.create({
      data: {
        company: { connect: { id: company.id } },
        ...dto,
      },
    });

    return location;
  }
}
