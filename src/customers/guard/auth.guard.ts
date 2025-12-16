import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthCustomerGuard extends PassportAuthGuard("jwt_customer") {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          title: "Сессия истекла",
          detail: "Срок вашей сессии истек.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
