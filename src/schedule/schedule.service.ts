import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleDto } from "./dto/schedule.dto";
import { UserService } from "src/user/user.service";
import { ISchedules } from "./types/schedules.type";
import { ISchedule, ScheduleRes } from "./types/schedule.type";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(dto: ScheduleDto, locationId: string): Promise<ScheduleRes> {
    const { user_id: userId } = dto;

    const user = await this.prismaService.userLocation.findUnique({
      where: { userId_locationId: { userId, locationId } },
      select: { id: true },
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

    const isExist = await this.prismaService.schedule.findFirst({
      where: { date: dto.date, userLocationId: user.id },
    });

    if (isExist)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка создания расписания",
          detail:
            "У выбранного сотрудника уже существует расписание на выбранную дату.",
          meta: { employee_id: user.id },
        },
        HttpStatus.BAD_REQUEST,
      );

    const schedule = await this.prismaService.$transaction(async (t) => {
      const sch = await t.schedule.create({
        data: { date: dto.date, userLocation: { connect: { id: user.id } } },
        select: { id: true, date: true },
      });

      await t.scheduleInterval.createMany({
        data: dto.intervals.map((i) => ({
          start: i.start,
          end: i.end,
          scheduleId: sch.id,
        })),
      });

      return sch;
    });

    return schedule;
  }

  async findAll(userId: string, locationId: string): Promise<ISchedules[]> {
    await this.userService.findByIdOptional(userId);

    const schedule = await this.prismaService.schedule.findMany({
      where: { userLocation: { userId, locationId } },
      select: {
        id: true,
        date: true,
        intervals: { select: { start: true, end: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return schedule;
  }

  async update(
    dto: ScheduleDto,
    locationId: string,
    scheduleId: number,
  ): Promise<ScheduleRes> {
    const { user_id: userId } = dto;

    if (!scheduleId)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка расписания",
          detail: "Не указан schedule_id",
        },
        HttpStatus.NOT_FOUND,
      );

    const user = await this.prismaService.userLocation.findUnique({
      where: { userId_locationId: { userId, locationId } },
      select: { id: true },
    });

    if (!user)
      throw new HttpException(
        {
          title: "Ошибка",
          description: "Пользователь не найден",
          detail: `user_id ${userId}`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );

    const isExist = await this.prismaService.schedule.findFirst({
      where: { id: scheduleId, userLocationId: user.id },
    });

    if (!isExist)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка расписания",
          detail: "Расписание не найдено",
        },
        HttpStatus.NOT_FOUND,
      );

    const schedule = await this.prismaService.$transaction(async (t) => {
      const sch = await t.schedule.update({
        where: { id: scheduleId },
        data: { date: dto.date, userLocation: { connect: { id: user.id } } },
        select: { id: true, date: true },
      });

      await t.scheduleInterval.deleteMany({ where: { scheduleId } });

      await t.scheduleInterval.createMany({
        data: dto.intervals.map((i) => ({
          start: i.start,
          end: i.end,
          scheduleId: sch.id,
        })),
      });

      return sch;
    });

    return schedule;
  }

  async delete(
    userId: string,
    scheduleId: number,
    locationId: string,
  ): Promise<SuccessResponse> {
    if (!userId)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка пользователя",
          detail: "Не указан user_id",
        },
        HttpStatus.NOT_FOUND,
      );

    const user = await this.prismaService.userLocation.findUnique({
      where: { id: userId, locationId },
      select: { id: true },
    });

    if (!user)
      throw new HttpException(
        {
          title: "Ошибка",
          description: "Пользователь не найден",
          detail: `user_id ${userId}`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );

    const isExist = await this.prismaService.schedule.findFirst({
      where: { id: scheduleId, userLocationId: userId },
    });

    if (!isExist)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка расписания",
          detail: "Расписание не найдено",
        },
        HttpStatus.NOT_FOUND,
      );

    await this.prismaService.schedule.delete({ where: { id: scheduleId } });

    return { success: true };
  }

  async findById(
    userId: string,
    scheduleId: number,
    locationId: string,
  ): Promise<ISchedule> {
    if (!userId)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка пользователя",
          detail: "Не указан user_id",
        },
        HttpStatus.NOT_FOUND,
      );

    const user = await this.prismaService.userLocation.findUnique({
      where: { id: userId, locationId },
      select: { id: true },
    });

    if (!user)
      throw new HttpException(
        {
          title: "Ошибка",
          description: "Пользователь не найден",
          detail: `user_id ${userId}`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );

    const schedule = await this.prismaService.schedule.findFirst({
      where: { id: scheduleId, userLocationId: userId },
      select: {
        id: true,
        intervals: { select: { start: true, end: true } },
        date: true,
        userLocation: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                position: true,
              },
            },
            locationId: true,
            isBanned: true,
          },
        },
      },
    });

    if (!schedule)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка расписания",
          detail: "Расписание не найдено",
        },
        HttpStatus.NOT_FOUND,
      );

    const res = {
      id: schedule.id,
      date: schedule.date,
      intervals: schedule.intervals,
      location_id: schedule.userLocation.locationId,
      user: {
        id: schedule.userLocation.id,
        name: `${schedule.userLocation.user.firstName} ${schedule.userLocation.user.lastName}`,
        phone: schedule.userLocation.user.phone,
        position: schedule.userLocation.user.position,
        is_banned: schedule.userLocation.isBanned,
      },
    } satisfies ISchedule;

    return res;
  }
}
