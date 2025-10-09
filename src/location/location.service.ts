import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LocationDto } from "./dto/location.dto";
import { AddressService } from "src/address/address.service";
import { LocationUpdateDto } from "./dto/location-update.dto";

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

  async update(dto: LocationUpdateDto, location_id: string) {
    await this.findById(location_id);

    const updated = await this.prismaService.location.update({
      where: { id: location_id },
      data: { ...dto },
    });

    return updated;
  }

  async getOne(location_id: string) {
    if (!location_id) throw new BadRequestException("Выберите локацию");

    const location = await this.prismaService.location.findUnique({
      where: { id: location_id },
      select: {
        id: true,
        name: true,
        description: true,
        phone: true,
        users: true,
        category: true,
        comfort: true,
        address: {
          select: {
            street: true,
            region: true,
            country: true,
            city: true,
            house: true,
            timezone: true,
            timezoneoffset: true,
            positionLat: true,
            positionLng: true,
            post_code: true,
          },
        },
      },
    });

    if (!location) throw new NotFoundException("Локация не найдена");

    return {
      id: location.id,
      name: location.name,
      description: location.description,
      phone: location.phone,
      timezone: `${location.address?.timezone} (${location.address?.timezoneoffset})`,
      user_count: location.users.length,
      category: location.category,
      comfort: location.comfort,
      address: {
        full_address: [
          location.address?.street,
          location.address?.house,
          location.address?.city,
          location.address?.region,
          location.address?.country,
        ]
          .filter(Boolean)
          .join("/"),
        street: location.address?.street,
        house: location.address?.house,
        city: location.address?.city,
        region: location.address?.region,
        country: location.address?.country,
        post_code: location.address?.post_code,
        map: {
          lat: location.address?.positionLat,
          lng: location.address?.positionLng,
        },
      },
    };
  }

  async getAll(companyId: string) {
    if (!companyId) throw new BadRequestException("Выберите компанию");

    const locations = await this.prismaService.location.findMany({
      where: { company: { id: companyId } },
      select: {
        id: true,
        name: true,
        description: true,
        phone: true,
        category: true,
        comfort: true,
        address: {
          select: {
            street: true,
            region: true,
            country: true,
            city: true,
            house: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (!locations.length) throw new NotFoundException("Локации не найдены");

    const data = locations.map((location) => ({
      id: location.id,
      name: location.name,
      description: location.description,
      phone: location.phone,
      category: location.category,
      comfort: location.comfort,
      address: {
        full_address: [
          location.address?.street,
          location.address?.house,
          location.address?.city,
          location.address?.region,
          location.address?.country,
        ]
          .filter(Boolean)
          .join("/"),
        street: location.address?.street,
        house: location.address?.house,
        city: location.address?.city,
        region: location.address?.region,
        country: location.address?.country,
      },
    }));

    return data;
  }

  async findUsers(location_id: string) {
    if (!location_id) throw new BadRequestException("Выберите локацию");

    const location = await this.prismaService.location.findUnique({
      where: { id: location_id },
      select: {
        id: true,
        name: true,
        phone: true,
        users: {
          select: {
            id: true,
            role: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                phone: true,
                status: true,
                position: true,
              },
            },
          },
        },
      },
    });

    if (!location) throw new NotFoundException("Локация не найдена");

    const users = location?.users.map((user) => ({
      _id: user.id,
      role: user.role,
      profile: {
        id: user.user.id,
        email: user.user.email,
        name: `${user.user.firstName} ${user.user.lastName}`,
        phone: user.user.phone,
        status: user.user.status,
        position: user.user.position,
      },
    }));

    return users;
  }
}
