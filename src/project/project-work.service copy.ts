/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProjectWorkDto } from "./dto/work/work.dto";

@Injectable()
export class ProjectWorkService {
  constructor(private readonly prismaService: PrismaService) {}

  async createWork(dto: ProjectWorkDto) {
    try {
      return await this.prismaService.work.create({
        data: {
          name: dto.name,
          description: dto.description,
          icon: dto.icon,
          specialization: {
            create: dto.specializationNames.map((name) => ({ name })),
          },
        },
        include: { specialization: true },
      });
    } catch (err) {
      console.error("Ошибка при создании Work", err);
      throw new InternalServerErrorException("Ошибка сервера");
    }
  }

  async getWorks() {
    const works = await this.prismaService.work.findMany({
      select: { id: true, name: true, description: true, icon: true },
    });

    return works;
  }

  async getWorkSpecializations(workId: string) {
    if (!workId) {
      throw new NotFoundException("Не указан workId");
    }

    const specializations =
      await this.prismaService.workSpecialization.findMany({
        where: { workId },
      });

    if (specializations.length === 0) {
      throw new NotFoundException("Специализация не найдена");
    }

    return specializations;
  }
}
