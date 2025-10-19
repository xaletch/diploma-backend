import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SendCodeDto } from "./dto/send-code.dto";
import { RedisService } from "src/redis/redis.service";
import { VerifyCodeDto } from "./dto/verify.dto";

@Injectable()
export class CustomersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  // ВСЕ ЧТО НАХОДИТСЯ СНИЗУ БУДЕТ УДАЛЕНО И НАПИСАНО В ОТДЕЛЬНОМ СЕРВИСЕ
  async firstByAccount(phone: string) {
    const customer = await this.prismaService.customerAccount.findUnique({
      where: { phone },
      select: { id: true, phone: true },
    });

    if (!customer)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Аккаунт не найден",
        },
        HttpStatus.NOT_FOUND,
      );

    return customer;
  }

  async sendCode(dto: SendCodeDto) {
    const { phone } = dto;
    const account = await this.prismaService.customerAccount.findUnique({
      where: { phone },
      include: { customer: true },
    });

    let customerPhone = account?.phone || null;

    if (!account) {
      const customer = await this.prismaService.customer.create({
        data: { phone },
      });

      const customerAccount = await this.prismaService.customerAccount.create({
        data: { phone, customerId: customer.id },
      });

      customerPhone = customerAccount.phone;
    }

    const code = Math.floor(Math.random() * 9000);

    await this.redisService.setEx(
      `auth:code:${customerPhone}`,
      300,
      code.toString(),
    );

    return { success: true, code };
  }

  async verifyCode(dto: VerifyCodeDto, ipAddress: string) {
    const { phone, code } = dto;

    const storeCode = await this.redisService.get(`auth:code:${phone}`);

    const { id: customerId, phone: customerPhone } =
      await this.firstByAccount(phone);

    if (!storeCode)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Код не найден",
          message: "Попробуйте еще раз",
        },
        HttpStatus.NOT_FOUND,
      );

    if (Number(storeCode) !== code)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Неверный код",
          message: "Попробуйте еще раз",
        },
        HttpStatus.NOT_FOUND,
      );

    await this.prismaService.customerAccount.update({
      where: { id: customerId },
      data: { verified: true, lastLoginAt: new Date() },
    });
    await this.redisService.del(`auth:code:${phone}`);

    // const payload = {
    //   sub: customerId,
    //   phone: customerPhone,
    // } satisfies JwtPayload;

    // const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });
    // const refreshToken = await this.tokenService.createRefreshToken({
    //   customerId,
    //   ipAddress,
    // });

    // return { access_token: accessToken, refresh_token: refreshToken };
    return { success: true, ipAddress, customerPhone };
  }
}
