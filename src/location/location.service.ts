import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LocationDto } from "./dto/location.dto";
import { AddressService } from "src/address/address.service";

@Injectable()
export class LocationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly addressService: AddressService,
  ) {}

  async create(dto: LocationDto, companyId: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new NotFoundException("Компания не найдена");

    const locationDTO = {
      name: dto.name,
      phone: dto.phone,
      comfort: dto.comfort,
    };

    const location = await this.prismaService.location.create({
      data: {
        company: { connect: { id: company.id } },
        ...locationDTO,
      },
    });

    const address = await this.addressService.create(dto, location.id);

    return { location, address };
  }

  async findById(id: string) {
    const location = await this.prismaService.location.findUnique({
      where: { id },
    });

    if (!location) throw new NotFoundException("Локация не найдена");

    return location;
  }
}
