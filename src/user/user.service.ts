import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreateDto } from "./dto/user.dto";
import { IUser, UserPrivate } from "./types/user.type";
import { UserStatus } from "@prisma/client";
import { BufferedFile } from "src/minio/file.model";
import { MinioService } from "src/minio/minio.service";
import { GlobalSuccessDto } from "src/shared/dto/global.dto";

@Injectable()
export class UserService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        lastName: true,
        firstName: true,
        avatar: true,
        role: { select: { id: true, name: true } },
        locations: true,
        company: {
          select: {
            id: true,
            name: true,
            currency: true,
            locations: {
              select: {
                users: true,
                id: true,
                name: true,
                phone: true,
                // users: {
                //   select: {
                //     id: true,
                //     role: true,
                //     user: {
                //       select: {
                //         id: true,
                //         email: true,
                //         status: true,
                //         firstName: true,
                //         lastName: true,
                //       },
                //     },
                //   },
                // },
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
      role: user.role?.name,
      role_id: { id: user.role?.id },
      first_name: user.firstName,
      last_name: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      locations: locations,
      my_locations: user.locations,
      company: {
        id: company?.id,
        name: company?.name,
        currency: company?.currency,
        industry: company?.industry,
        specialization: company?.specialization.name,
      },
    };
    // return user;
  }

  public async findByEmail(email: string): Promise<IUser> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException("Аккаунт не найден");

    return user;
  }

  public async findByIdOptional(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, avatar: true },
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

    const role = await this.prismaService.role.findUnique({ where: { id: 1 } });
    if (!role || role.name !== "owner") throw new Error("Роль не найдена");

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        firstName: dto.first_name,
        lastName: dto.last_name,
        passwordHash: pass,
        status: status,
        role: { connect: { id: 1, name: "owner" } },
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

  public async currentUser(user_id: string): Promise<UserPrivate> {
    const user = await this.prismaService.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: { select: { name: true } },
          },
        },
        company: { select: { id: true } },
      },
    });

    if (!user) throw new NotFoundException("Пользователь не найден");

    const data: UserPrivate = {
      id: user.id,
      email: user.email,
      role: user.role ? { id: user.role.id, name: user.role.name } : null,
      company: user.company ? { id: user.company.id } : null,
      companyId: user.company?.id ?? null,
      permissions: user.role?.permissions ?? null,
    };

    return data;
  }

  async uploadAvatar(
    image: BufferedFile,
    userId: string,
  ) {
    const { avatar } = await this.findByIdOptional(userId);
    const upload = await this.minioService.uploadFile(
      "user-avatars",
      image,
      avatar ?? "",
    );

    await this.prismaService.user.update({
      where: { id: userId },
      data: { avatar: upload },
    });

    const t = await this.minioService.getFileUrl("user-avatars", upload);

    return { success: true, t };
  }
}
