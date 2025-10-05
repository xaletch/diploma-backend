import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAddressDto } from "./dto/create.dto";

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateAddressDto, locationId: string) {
    const location = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });

    if (!location) throw new NotFoundException("Локация не найдена");

    const address = await this.prismaService.address.create({
      data: {
        location: { connect: { id: locationId } },
        street: dto.street,
        house: dto.house,
        city: dto.city,
        post_code: dto.post_code,
        country: dto.country,
        region: dto.region,
        timezone: dto.timezone,
        timezoneoffset: dto.timezone_offset,
        positionLat: dto.lat,
        positionLng: dto.lng,
      },
    });

    return address;
  }
}
