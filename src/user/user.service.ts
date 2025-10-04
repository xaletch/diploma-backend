import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreateDto } from "./dto/user.dto";
import { IUser, IUserPrivate } from "./types/user.type";

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string): Promise<IUserPrivate> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        lastName: true,
        firstName: true,
        role: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) throw new Error("Пользователь не найден");

    const company = user.company?.id ? user.company : null;

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
      full_name: `${user.lastName} ${user.firstName}`,
      company: company,
    };
  }

  public async findByEmail(email: string): Promise<IUser> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException("Аккаунт не найден");

    return user;
  }

  public async findByEmailOptional(email: string): Promise<IUser | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  public async create(dto: UserCreateDto): Promise<IUser> {
    if (!dto.password) {
      throw new BadRequestException("Password is required");
    }
    const pass = dto.password ? await bcrypt.hash(dto.password, 8) : "";

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        firstName: dto.first_name,
        lastName: dto.last_name,
        passwordHash: pass,
        role: "owner",
      },
    });

    return user;
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // public async findByPhone(phone: string) {
  //   const user = await this.prismaService.user.findUnique({ where: { phone } });

  //   return user;
  // }

  // public async createUser(phone: string) {
  //   return this.prismaService.user.create({
  //     data: { phone },
  //   });
  // }

  // async updateUserStatus(userId: string, status: "pending" | "active") {
  //   return this.prismaService.user.update({
  //     where: { id: userId },
  //     data: { status },
  //   });
  // }
}
