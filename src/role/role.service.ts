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
    const role = await this.prismaService.role.findUnique({
      where: { id: dto.role_id },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException("Роль не найдена");
    }

    const existing = await this.prismaService.permission.findUnique({
      where: { name: dto.name },
      include: { roles: true },
    });

    if (existing && existing.roles.some((r) => r.id === dto.role_id))
      throw new BadRequestException("permission уже существует");

    if (existing) {
      return this.prismaService.permission.update({
        where: { id: existing.id },
        data: {
          roles: { connect: { id: dto.role_id } },
        },
        include: { roles: true },
      });
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
