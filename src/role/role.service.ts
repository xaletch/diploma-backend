import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IRole } from "./types/role.type";
import { RoleDto } from "./dto/role.dto";

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(role_id: number): Promise<IRole | null> {
    const role = await this.prismaService.role.findUnique({
      where: { id: role_id },
      select: { id: true, name: true },
    });

    if (!role) throw new NotFoundException("Роль не найдена");

    return role;
  }

  async createPermission(dto: RoleDto) {
    const existing = await this.prismaService.permission.findUnique({
      where: { name: dto.name },
    });

    if (existing) throw new BadRequestException("permission уже существует");

    const role = await this.prismaService.role.findUnique({
      where: { id: dto.role_id },
    });

    if (!role) {
      throw new NotFoundException("Роль не найдена");
    }

    const permission = await this.prismaService.permission.create({
      data: {
        name: dto.name,
        roles: {
          connect: { id: dto.role_id },
        },
      },
      include: { roles: true },
    });

    return permission;
  }
}
