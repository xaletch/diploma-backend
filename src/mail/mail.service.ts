import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiUrl =
    "https://api.rusender.ru/api/v1/external-mails/send";

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async send(
    to: string,
    toName: string,
    subject: string,
    html: string,
  ) {
    await firstValueFrom(
      this.httpService.post(
        this.apiUrl,
        {
          idempotencyKey: crypto.randomUUID(),
          mail: {
            to: { email: to, name: toName },
            from: {
              email: this.configService.get("MAIL_FROM"),
              name: this.configService.get("MAIL_FROM_NAME"),
            },
            subject,
            html,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": this.configService.get("RUSENDER_API_KEY"),
          },
        },
      ),
    );
  }

  async sendLocationAddedNotify(email: string, name: string) {
    try {
      await this.send(
        email,
        name,
        "Вас добавили в новую локацию",
        this.locationAddedTemplate(name),
      );
      console.log("Вас добавили в новую локацию:", email, name);
    } catch (err) {
      console.log(" Вас добавили в новую локацию err", err);
      this.logger.error(`Ошибка отправки уведомления ${email}`, err);
    }
  }

  async sendInviteNotify(email: string, name: string, url: string) {
    try {
      await this.send(
        email,
        name,
        "Приглашение на регистрацию",
        this.inviteTemplate(name, url),
      );
      console.log("Приглашение на регистрацию:", email, name, url);
    } catch (err) {
      console.log("Приглашение на регистрацию err", err);
      this.logger.error(`Ошибка отправки приглашения ${email}`, err);
    }
  }

  private inviteTemplate(name: string, inviteUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px;">
        <h2>Привет, ${name}! 👋</h2>
        <p>Вас пригласили зарегистрироваться в системе.</p>
        <a href="${inviteUrl}" style="display:inline-block; padding:14px 28px; background:#4F46E5; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
          Завершить регистрацию
        </a>
        <p style="margin-top:24px; font-size:12px; color:#999;">
          Ссылка действует 7 дней.<br/>
          Если вы не ожидали это письмо — просто проигнорируйте его.
        </p>
      </div>
    `;
  }

  private locationAddedTemplate(name: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px;">
        <h2>Привет, ${name}! 👋</h2>
        <p>Вас добавили в новую локацию.</p>
        <p>Войдите в систему, чтобы увидеть детали.</p>
      </div>
    `;
  }
}
