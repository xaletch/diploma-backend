import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { AccessService } from "../access.service";
import { UserService } from "src/user/user.service";
import { UserPrivate } from "src/user/types/user.type";

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    private readonly accessService: AccessService,
    private readonly userService: UserService,
  ) {}

  // НЕМНОГО НЕ СХОДИТСЯ - СНЕСТИ ГВАРД ДЛЯ КОМПАНИИ И ЛОКАЦИИ И ОБЪЕДИНИТЬ
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: UserPrivate = req.user;
    const companyId = user.companyId;

    const access = await this.accessService.accessCompany(user, companyId);
    if (!access)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          title: "Доступ запрещён!",
          description: `Доступ к данному ресурсу ограничен.`,
          details: [
            "Причина может заключаться в следующем:",
            "- Ваш аккаунт или местоположение не соответствуют требованиям компании.",
            "- Вы не являетесь сотрудником нашей организации.",
            "- Ваши права доступа недостаточны для просмотра этого ресурса.",
          ],
          recommendations: [
            "Проверяйте свою роль перед попыткой повторного входа.",
            "Обратитесь в службу поддержки для консультации.",
          ],
        },
        HttpStatus.FORBIDDEN,
        { cause: new Error() },
      );

    return true;
  }
}
