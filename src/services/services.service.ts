import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ServiceCreateDto } from "./dto/service.dto";
import { IService, IServices } from "./types/service.type";
import { ServiceCategoryDto } from "./dto/service-category.dto";
import { AddedUsersDto } from "./dto/added-users.dto";
import { AddedLocationsDto } from "./dto/added-locations.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(company_id: string): Promise<IServices[]> {
    const services = await this.prismaService.service.findMany({
      where: { companyId: company_id },
      select: {
        id: true,
        name: true,
        duration: true,
        timeStart: true,
        timeEnd: true,
        category: true,
        price: {
          select: {
            id: true,
            price: true,
            costPrice: true,
          },
        },
        publicName: true,
        users: {
          select: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        locations: {
          select: {
            location: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!services.length)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка: услуги не обнаружены",
          message:
            "Запрошенные услуги не были найдены. Это может произойти, если вы ранее не создавали никаких услуг. Рекомендуем начать с добавления первой услуги.",
        },
        HttpStatus.NOT_FOUND,
      );

    const response: IServices[] = services.map((s) => {
      return {
        id: s.id,
        name: s.name,
        duration: s.duration,
        category: s.category,
        public_name: s.publicName,
        price: s.price!.price ?? null,
        prices: {
          price: s.price?.price ?? null,
          cost_price: s.price?.costPrice ?? null,
        },
        users_length: s.users.length,
        locations_length: s.locations.length,
      };
    });

    return response;
  }

  async getFirst(service_id: string, company_id: string): Promise<IService> {
    const s = await this.prismaService.service.findFirst({
      where: { id: service_id, companyId: company_id },
      select: {
        id: true,
        name: true,
        duration: true,
        days: true,
        timeStart: true,
        timeEnd: true,
        category: true,
        price: {
          select: {
            id: true,
            price: true,
            costPrice: true,
          },
        },
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
        publicName: true,
        users: {
          select: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        locations: {
          select: {
            location: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!s)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка: услуга не обнаружена",
          message:
            "Запрошенная услуга не были найдена. Это может произойти, если вы ранее не создавали никаких услуг. Рекомендуем начать с добавления первой услуги.",
        },
        HttpStatus.NOT_FOUND,
      );

    const response: IService = {
      id: s.id,
      name: s.name,
      duration: s.duration,
      public_name: s.publicName,
      category: s.category,
      price: s.price!.price ?? null,
      date: { days: s.days, time_start: s.timeStart, time_end: s.timeEnd },
      prices: {
        price: s.price?.price ?? null,
        cost_price: s.price?.costPrice ?? null,
      },
      discount: s.discount
        ? {
            date_type: s.discount.dateType,
            days: s.discount.days,
            price: s.discount.price ?? null,
            time_start: s.discount.timeStart ?? null,
            time_end: s.discount.timeEnd ?? null,
          }
        : null,
      users: s.users.map((u) => ({
        id: u.user.id,
        name: `${u.user.firstName} ${u.user.lastName}`,
      })),
      locations: s.locations.map((l) => ({
        id: l.location.id,
        name: l.location.name,
      })),
    };

    return response;
  }

  async create(dto: ServiceCreateDto, companyId: string) {
    const users = await this.prismaService.user.findMany({
      where: { companyId },
    });
    const locations = await this.prismaService.location.findMany({
      where: { companyId },
    });

    if (!users.length)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка создания услуги",
          message:
            "Отсутствуют зарегистрированные пользователи. Услуга не может быть создана.",
        },
        HttpStatus.NOT_FOUND,
      );
    if (!locations.length)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка создания услуги",
          message:
            "Нет ни одной доступной локации. Услугу невозможно привязать к месту.",
        },
        HttpStatus.NOT_FOUND,
      );

    const serviceDto = {
      name: dto.name,
      publicName: dto.public_name,
      mark: dto.mark,
      duration: dto.duration,
      type: dto.type,
      category: "",
      companyId,
    };

    const service = await this.prismaService.$transaction(async (t) => {
      const service = await t.service.create({
        data: {
          ...serviceDto,
          days: dto.days,
          timeStart: dto.time_start,
          timeEnd: dto.time_end,
          price: {
            create: {
              price: dto.price,
              costPrice: dto.cost_price,
            },
          },
          discount: {
            create: {
              dateType: dto.date_type,
              days: dto.discount_days,
              price: dto.discount_price,
              timeStart: dto.discount_time_start,
              timeEnd: dto.discount_time_end,
            },
          },
        },
        select: {
          id: true,
          name: true,
          mark: true,
          duration: true,
          type: true,
        },
      });

      await t.userService.createMany({
        data: users.map((u) => ({ userId: u.id, serviceId: service.id })),
      });
      await t.locationService.createMany({
        data: locations.map((l) => ({
          locationId: l.id,
          serviceId: service.id,
        })),
      });

      return service;
    });

    return service;
  }

  async delete(service_id: string) {
    const service = await this.prismaService.service.findFirst({
      where: { id: service_id },
      select: { id: true },
    });

    if (!service)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка: услуга не обнаружена",
          message:
            "Запрошенная услуга не были найдена. Это может произойти, если вы ранее не создавали никаких услуг. Рекомендуем начать с добавления первой услуги.",
        },
        HttpStatus.NOT_FOUND,
      );

    await this.prismaService.service.delete({
      where: { id: service.id },
      select: { id: true, name: true, mark: true, duration: true, type: true },
    });

    return { status: "deleted" };
  }

  async createCategory(dto: ServiceCategoryDto, companyId: string) {
    const isExists = await this.prismaService.serviceCategory.findFirst({
      where: { name: dto.name },
    });

    if (isExists)
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          title: "Категория уже существует",
        },
        HttpStatus.CONFLICT,
      );

    const category = await this.prismaService.serviceCategory.create({
      data: { name: dto.name, companyId },
      select: { id: true, name: true },
    });

    return category;
  }

  async getAllCategory(companyId: string) {
    const category = await this.prismaService.serviceCategory.findMany({
      where: { companyId },
      select: { id: true, name: true },
    });

    return category;
  }

  async deleteCategory(categoryId: number) {
    const isExists = await this.prismaService.serviceCategory.findUnique({
      where: { id: categoryId },
    });

    if (!isExists)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Категория не найдена",
        },
        HttpStatus.NOT_FOUND,
      );

    const category = await this.prismaService.serviceCategory.delete({
      where: { id: categoryId },
      select: { id: true, name: true },
    });

    return category;
  }

  async addedUsers(
    dto: AddedUsersDto,
    serviceId: string,
    companyId: string,
  ): Promise<{ success: boolean }> {
    const { user_ids: userIds } = dto;
    const service = await this.prismaService.service.findFirst({
      where: { id: serviceId, companyId },
      select: { id: true },
    });

    if (!service)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка: услуга не обнаружена",
          message:
            "Запрошенная услуга не были найдена. Это может произойти, если вы ранее не создавали никаких услуг. Рекомендуем начать с добавления первой услуги.",
        },
        HttpStatus.NOT_FOUND,
      );

    const users = await this.prismaService.user.findMany({
      where: { id: { in: userIds }, companyId },
      select: { id: true },
    });

    const existingUserIds = users.map((u) => u.id);
    const invalidIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (invalidIds.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка: некоторые пользователи не найдены",
          detail: `Пользователи с id ${invalidIds.join(", ")} не существуют.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.$transaction([
      this.prismaService.userService.deleteMany({ where: { serviceId } }),
      this.prismaService.userService.createMany({
        data: userIds.map((userId) => ({ userId, serviceId: service.id })),
      }),
    ]);

    return { success: true };
  }

  async addedLocations(
    dto: AddedLocationsDto,
    serviceId: string,
    companyId: string,
  ): Promise<{ success: boolean }> {
    const { location_ids: locationIds } = dto;
    const service = await this.prismaService.service.findFirst({
      where: { id: serviceId, companyId },
      select: { id: true },
    });

    if (!service)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка: услуга не обнаружена",
          message:
            "Запрошенная услуга не были найдена. Это может произойти, если вы ранее не создавали никаких услуг. Рекомендуем начать с добавления первой услуги.",
        },
        HttpStatus.NOT_FOUND,
      );

    const locations = await this.prismaService.location.findMany({
      where: { id: { in: locationIds }, companyId },
      select: { id: true },
    });

    const existingLocationIds = locations.map((u) => u.id);
    const invalidIds = locationIds.filter(
      (id) => !existingLocationIds.includes(id),
    );

    if (invalidIds.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка: некоторые локации не найдены",
          detail: `Локации с id ${invalidIds.join(", ")} не существуют.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.$transaction([
      this.prismaService.locationService.deleteMany({ where: { serviceId } }),
      this.prismaService.locationService.createMany({
        data: locationIds.map((locationId) => ({
          locationId,
          serviceId: service.id,
        })),
      }),
    ]);

    return { success: true };
  }
}
