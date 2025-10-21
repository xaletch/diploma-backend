import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(dto: ScheduleCreateDto, locationId: string) {
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

  async findAll(userId: string, locationId: string) {
    await this.userService.findByIdOptional(userId);

    const schedule = await this.prismaService.schedule.findMany({
      where: { userLocation: { userId, locationId } },
      select: {
        id: true,
        date: true,
        intervals: { select: { start: true, end: true } },
      },
    });

    return schedule;
  }
}
