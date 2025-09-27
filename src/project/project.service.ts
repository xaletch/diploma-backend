import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProjectDto } from "./dto/project.dto";
import { OwnerProjectDto } from "./dto/owner-project.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  private async createOwnerProject(dto: OwnerProjectDto) {
    try {
      const user = await this.userService.findById(dto.userId);

      if (!user) throw new NotFoundException("Пользователь не найден");

      await this.prismaService.userProject.create({ data: dto });
    } catch (err) {
      console.log("Ошибка при пользователя проекта", err);
      throw new InternalServerErrorException("Ошибка сервера");
    }
  }

  async create(dto: ProjectDto, userId: string) {
    try {
      const { id: project_id, name } = await this.prismaService.project.create({
        data: dto,
        omit: { createdAt: true, updatedAt: true },
      });

      await this.createOwnerProject({
        userId,
        projectId: project_id,
        role: "creator",
      });

      return { status: 201, name, project_id, message: "Проект создан" };
    } catch (err) {
      console.log("Ошибка при создании проекта", err);
      throw new InternalServerErrorException("Ошибка сервера");
    }
  }
}
