import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IRole } from "./types/role.type";

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
}
