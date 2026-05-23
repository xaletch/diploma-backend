import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { SmscResponse } from "./types/sms.types";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiUrl = "https://smsc.ru/sys/send.php";

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendSms(phone: string, message: string): Promise<void> {
    const login = this.configService.get<string>("SMSC_LOGIN");
    const password = this.configService.get<string>("SMSC_PASSWORD");

    const normalizedPhone = phone.replace(/\D/g, "");

    const { data } = await firstValueFrom(
      this.httpService.get<SmscResponse>(this.apiUrl, {
        params: {
          login,
          psw: password,
          phones: normalizedPhone,
          mes: message,
          fmt: 3,
          charset: "utf-8",
        },
      }),
    );

    if ("error_code" in data) {
      this.logger.error(`SMSC error: ${data.error} (code: ${data.error_code})`);
      throw new HttpException(
        {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          title: "Ошибка отправки SMS",
          description: "Попробуйте позже",
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    this.logger.log(
      `SMS sent to ${normalizedPhone}, id=${data.id}, cnt=${data.cnt}`,
    );
  }
}
