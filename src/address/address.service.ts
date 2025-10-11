import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAddressDto } from "./dto/create.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    t: Prisma.TransactionClient,
    dto: CreateAddressDto,
    locationId: string,
  ) {
    const address = await t.address.create({
      data: {
        locationId,
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
