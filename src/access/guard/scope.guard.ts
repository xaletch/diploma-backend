import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SCOPE_KEY } from "../decorator/scopes.decorator";
import { UserPrivate } from "src/user/types/user.type";

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes: string[] =
      this.reflector.get<string[]>(SCOPE_KEY, context.getHandler()) || [];

    if (!requiredScopes.length) return true;

    const req = context.switchToHttp().getRequest();
    const user: UserPrivate = req.user;

    if (!user.permissions?.length)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          title: "Доступ запрещён!",
          description:
            "У вашей роли отсутствуют разрешения для этого действия.",
          details: [
            "Ваш аккаунт не обладает нужными правами.",
            "Обратитесь к владельцу компании для получения доступа.",
          ],
          recommendations: [
            "Проверьте уровень своей роли в настройках аккаунта.",
            "Если вы считаете, что это ошибка — свяжитесь с администратором.",
          ],
        },
        HttpStatus.FORBIDDEN,
      );

    const userPermissions = user.permissions.map((p) => p.name) || [];

    const hasAccess = requiredScopes.every((scope) =>
      userPermissions.includes(scope),
    );

    if (!hasAccess)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          title: "Недостаточно прав!",
          description: `Для выполнения этого действия требуется одно из следующих разрешений: ${requiredScopes.join(
            ", ",
          )}.`,
          details: [
            "Вы вошли в систему, но ваша роль не имеет нужных прав.",
            "Обратитесь к администратору или владельцу компании.",
          ],
          recommendations: [
            "Обновите свои права доступа.",
            "Попробуйте выполнить другое действие, доступное вашей роли.",
          ],
        },
        HttpStatus.FORBIDDEN,
      );

    return true;
  }
}
