import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreateDto } from "./dto/user.dto";
import { IUser } from "./types/user.type";
import { UserStatus } from "@prisma/client";

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
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
            currency: true,
            locations: {
              select: {
                id: true,
                name: true,
                phone: true,
                address: { select: { country: true } },
              },
            },
            industry: { select: { id: true, name: true } },
            specialization: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) throw new Error("Пользователь не найден");

    const company = user.company?.id ? user.company : null;

    const locations =
      company?.locations?.map((location) => ({
        id: location.id,
        name: location.name,
        phone: location.phone,
        company_name: company.name,
        currency: company.currency,
        country: location.address?.country,
      })) ?? null;

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      locations: locations,
      company: {
        id: company?.id,
        name: company?.name,
        currency: company?.currency,
        industry: company?.industry,
        specialization: company?.specialization.name,
      },
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

  public async create(dto: UserCreateDto, status: UserStatus): Promise<IUser> {
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
        status: status,
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

// /invite/x3MwHiXvG3hCd8n1JHukEWXVR2IaKKDmqYLHhfpnEnmY9jehlIWA6FCWbX7ZIVnAZ8cvx1aXvYuiTht3lcnfcBtK63iYjKjKlbxQ7BOh2GVIHZQXBnVVueI2t2toQG6bxaPLNG9PBZGK2W5naDbUejBqyGy0wgQ17LsVMO260PLzmmqXIzWtqugp0btKSBX8z1NPHC0CBTmMWHFWw0FvoDcrKzcM8JXzbxILaQWTMq6pkIUrMGSx2lGrQKqNVZ4?email=kiril.kolesnikov5%40gmail.com
