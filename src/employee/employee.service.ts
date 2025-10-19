import {
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { InviteDto } from "./dto/invite.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { LocationService } from "src/location/location.service";
import { generateInviteToken } from "./utils/generate-invite-token.util";
import { RegisterEmployeeDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/auth/token/token.service";
import { JwtPayload } from "src/auth/jwt.payload";
import { RoleService } from "src/role/role.service";
import { CheckInviteDto } from "./dto/check-invite.dto";
import { EmployeeUpdateDto } from "./dto/employee-update.dto";
import { EmployeeUpdateResponse } from "./types/update.type";
import { EmployeeDeleteResponse } from "./types/delete.type";
import { EmployeeAuthResponse } from "./types/employee-auth.type";
import { InviteResponse } from "./types/invite.type";
import { CheckInviteResponse } from "./types/check-invite.type";
import { EmployeeFirst } from "./types/employee.type";
import { EmployeeBlockedDto } from "./dto/blocked.dto";
import { SuccessResponse } from "./types/success.type";

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly locationService: LocationService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
  ) {}

  async findById(id: string): Promise<EmployeeFirst> {
    const employee = await this.prismaService.userLocation.findUnique({
      where: { id },
      select: {
        id: true,
        locationId: true,
        roleId: true,
        birthday: true,
        note: true,
        isBanned: true,
      },
    });

    if (!employee)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Сотрудник не найден",
        },
        HttpStatus.NOT_FOUND,
      );

    return employee;
  }

  async invite(dto: InviteDto): Promise<InviteResponse> {
    const token = generateInviteToken();

    await this.prismaService.invite.create({
      data: {
        token: token,
        email: dto.email,
        locationId: dto.location_id,
        role: dto.role,
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    });

    return { url: `http://localhost:8080/invite/${token}?email=${dto.email}` };
  }

  async checkInvite(dto: CheckInviteDto): Promise<CheckInviteResponse> {
    const { token } = dto;
    const isExist = await this.prismaService.invite.findFirst({
      where: { token: token },
    });

    if (!isExist || isExist.expiresAt < new Date())
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ссылка устарела",
          message:
            "Срок действия вашей ссылки истек. Пожалуйста, проверьте правильность введенного текста или запросите новую ссылку.",
        },
        HttpStatus.NOT_FOUND,
      );

    return { valid: true };
  }

  async create(dto: EmployeeDto, companyId: string): Promise<InviteResponse> {
    const isExist = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    await this.roleService.findById(dto.role);

    if (isExist) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error:
            isExist.status === "active"
              ? "Пользователь уже существует"
              : "Приглашение уже отправлено",
        },
        HttpStatus.CONFLICT,
        { cause: new Error() },
      );
    }

    await this.locationService.findById(dto.location_id);

    await this.prismaService.$transaction(async (t) => {
      const user = await t.user.create({
        data: {
          email: dto.email,
          lastName: dto.last_name,
          firstName: dto.first_name,
          phone: dto.phone,
          status: "invited",
          companyId: companyId,
          roleId: dto.role,
          position: dto.position,
        },
      });

      await t.userLocation.create({
        data: {
          userId: user.id,
          locationId: dto.location_id,
          roleId: dto.role,
          birthday: dto.birthdate,
          note: dto.note,
        },
      });
    });

    const data = {
      email: dto.email,
      location_id: dto.location_id,
      role: dto.role,
    } satisfies InviteDto;

    return await this.invite(data);
  }

  async register(
    dto: RegisterEmployeeDto,
    ipAddress: string,
  ): Promise<EmployeeAuthResponse> {
    const invite = await this.prismaService.invite.findUnique({
      where: { token: dto.token },
    });
    if (!invite) throw new NotFoundException("Приглашение не найдено");
    if (invite.expiresAt < new Date())
      throw new GoneException("Приглашение устарело");

    const pass = await bcrypt.hash(dto.password, 8);

    const user = await this.prismaService.$transaction(async (t) => {
      const user = await t.user.update({
        where: { email: invite.email },
        data: {
          lastName: dto.last_name,
          phone: dto.phone,
          passwordHash: pass,
          status: "active",
          position: dto.position,
        },
      });

      await t.invite.delete({ where: { token: dto.token } });

      return user;
    });

    const payload = { sub: user.id, email: user.email } satisfies JwtPayload;

    const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refreshToken = await this.tokenService.createRefreshToken({
      userId: payload.sub,
      ipAddress,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async update(
    dto: EmployeeUpdateDto,
    userId: string,
  ): Promise<EmployeeUpdateResponse> {
    const employee = await this.findById(userId);
    const user = await this.prismaService.user.findFirst({
      where: { locations: { some: { id: employee.id } } },
      select: { id: true },
    });

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Сотрудник не найден",
        },
        HttpStatus.NOT_FOUND,
      );

    const userUpdate = await this.prismaService.$transaction(async (t) => {
      const update = await t.user.update({
        where: { id: user.id },
        data: {
          email: dto.email,
          firstName: dto.first_name,
          lastName: dto.last_name,
          phone: dto.phone,
          position: dto.position,
          roleId: dto.role,
        },
        select: { id: true, email: true, phone: true },
      });

      await t.userLocation.update({
        where: { id: employee.id },
        data: {
          note: dto.note,
          isBanned: dto.is_banned ?? false,
          birthday: dto.birthdate,
          roleId: dto.role,
        },
      });

      return update;
    });

    return {
      user: {
        id: userUpdate.id,
        email: userUpdate.email,
        phone: userUpdate.phone,
      },
      success: true,
    };
  }

  async blocked(
    dto: EmployeeBlockedDto,
    userId: string,
    locationId: string,
  ): Promise<SuccessResponse> {
    const isExist = await this.prismaService.userLocation.findUnique({
      where: { userId_locationId: { userId, locationId } },
    });

    if (!isExist)
      throw new HttpException(
        {
          title: "Ошибка",
          description: "Пользователь не найден",
          detail: [`ID ${userId}`],
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );

    const { is_banned } = dto;

    await this.prismaService.userLocation.update({
      where: { userId_locationId: { userId, locationId } },
      data: { isBanned: is_banned },
    });

    return { success: true };
  }

  async delete(
    userId: string,
    locationId: string,
  ): Promise<EmployeeDeleteResponse> {
    const isExist = await this.prismaService.userLocation.findUnique({
      where: { userId_locationId: { userId, locationId } },
    });

    if (!isExist)
      throw new HttpException(
        {
          title: "Ошибка",
          description: "Пользователь не найден",
          detail: [`ID ${userId}`],
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );

    const user = await this.prismaService.userLocation.delete({
      where: { userId_locationId: { userId, locationId } },
    });

    return {
      success: true,
      user: { id: user.id, location_id: user.locationId },
    };
  }
}
