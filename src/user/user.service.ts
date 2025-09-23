import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new Error("Пользователь не найден");

    return user;
  }

  public async findByPhone(phone: string) {
    const user = await this.prismaService.user.findUnique({ where: { phone } });

    return user;
  }

  public async createUser(phone: string) {
    return this.prismaService.user.create({
      data: { phone },
    });
  }

  async updateUserStatus(userId: string, status: "pending" | "active") {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { status },
    });
  }
}
