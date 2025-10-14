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

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly locationService: LocationService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
  ) {}

  async invite(dto: InviteDto) {
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

  async checkInvite(dto: CheckInviteDto) {
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

  async create(dto: EmployeeDto, companyId: string) {
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

  async register(dto: RegisterEmployeeDto, ipAddress: string) {
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

  // СЕЙЧАС РАБОТАЕТ ТАК, ЧТО МОЖНО УДАЛИТЬ ЛЮБОГО ПОЛЬЗОВАТЕЛЯ ДАЖЕ ТОГО КОГО НЕТ В ЛОКАЦИИ
  async delete(userId: string) {
    const isExist = await this.prismaService.user.findUnique({
      where: { id: userId },
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

    const user = await this.prismaService.user.delete({
      where: { id: userId },
    });

    return {
      message: "Сотрудник удален",
      location: { id: user.id, email: user.email },
    };
  }
}
