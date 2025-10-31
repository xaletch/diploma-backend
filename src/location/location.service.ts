import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LocationDto } from "./dto/location.dto";
import { AddressService } from "src/address/address.service";
import { LocationUpdateDto } from "./dto/location-update.dto";
import { Prisma } from "@prisma/client";
import { ILocationUser } from "./types/location-user.type";
import { BufferedFile } from "src/minio/file.model";
import { GlobalSuccessDto } from "src/shared/dto/global.dto";
import { MinioService } from "src/minio/minio.service";
import { LocationsDto } from "./dto/locations.dto";
import { LocationFirstDto } from "./dto/location-first.dto";

@Injectable()
export class LocationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly addressService: AddressService,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: LocationDto, userId: string, companyId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });
    const isExists = await this.prismaService.location.findFirst({
      where: { companyId: companyId, name: dto.name },
    });

    if (isExists)
      throw new BadRequestException("Локация с таким именем уже существует");

    const locationDTO = {
      name: dto.name,
      phone: dto.phone,
      comfort: dto.comfort,
    };

    const location = await this.prismaService.$transaction(async (t) => {
      const location = await t.location.create({
        data: {
          company: { connect: { id: companyId } },
          ...locationDTO,
        },
      });

      const address = await this.addressService.create(t, dto, location.id);

      await t.userLocation.create({
        data: {
          userId,
          locationId: location.id,
          roleId: user?.roleId,
        },
      });

      return { location, address };
    });

    return location;
  }

  async createFirst(
    t: Prisma.TransactionClient,
    dto: LocationDto,
    userId: string,
    roleId: number | undefined,
    companyId: string,
  ) {
    const { name, phone, comfort } = dto;
    const locationDto = { name, phone, comfort };

    const location = await t.location.create({
      data: {
        company: { connect: { id: companyId } },
        ...locationDto,
      },
    });

    await this.addressService.create(t, dto, location.id);

    await t.userLocation.create({
      data: {
        userId,
        locationId: location.id,
        roleId,
      },
    });
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

  async delete(location_id: string) {
    const deleted = await this.prismaService.location.delete({
      where: { id: location_id },
    });

    if (!deleted)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          title: "Ошибка",
          description: `Не удалось удалить локацию`,
        },
        HttpStatus.BAD_REQUEST,
        { cause: new Error() },
      );

    return {
      message: "Локация удалена",
      location: { id: deleted.id, name: deleted.name },
    };
  }

  async getOne(location_id: string): Promise<LocationFirstDto> {
    if (!location_id) throw new BadRequestException("Выберите локацию");

    const location = await this.prismaService.location.findUnique({
      where: { id: location_id },
      select: {
        id: true,
        name: true,
        avatar: true,
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
      avatar: location.avatar,
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

  async getAll(companyId: string): Promise<LocationsDto[]> {
    if (!companyId) throw new BadRequestException("Выберите компанию");

    const locations = await this.prismaService.location.findMany({
      where: { company: { id: companyId } },
      select: {
        id: true,
        name: true,
        avatar: true,
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
      avatar: location.avatar,
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

  async findUsers(location_id: string): Promise<ILocationUser[]> {
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
            role: { select: { id: true, name: true } },
            isBanned: true,
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
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!location) throw new NotFoundException("Локация не найдена");

    const users = location?.users.map((user) => ({
      user_id: user.id,
      role: user.role?.name,
      is_banned: user.isBanned,
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

  async getFirstUser(
    userId: string,
    locationId: string,
  ): Promise<ILocationUser> {
    const user = await this.prismaService.userLocation.findUnique({
      where: { userId_locationId: { userId, locationId } },
      select: {
        id: true,
        role: { select: { id: true, name: true } },
        isBanned: true,
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
    });

    if (!user)
      throw new HttpException(
        {
          title: "Ошибка",
          description: "Пользователь не найден",
          detail: [`ID ${userId}`],
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );

    const res = {
      user_id: user.id,
      role: user.role?.name,
      is_banned: user.isBanned,
      profile: {
        id: user.user.id,
        email: user.user.email,
        name: `${user.user.firstName} ${user.user.lastName}`,
        phone: user.user.phone,
        status: user.user.status,
        position: user.user.position,
      },
    };

    return res;
  }

  async uploadAvatar(
    image: BufferedFile,
    locationId: string,
  ): Promise<GlobalSuccessDto> {
    const { avatar } = await this.findById(locationId);
    const upload = await this.minioService.uploadFile(
      "location-avatars",
      image,
      avatar ?? "",
    );

    await this.prismaService.location.update({
      where: { id: locationId },
      data: { avatar: upload },
    });
    return { success: true };
  }
}
