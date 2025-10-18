import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { CustomerAccount } from "@prisma/client";
import { ICustomer } from "../types/customer.type";

interface RequestWithUser extends Request {
  user: ICustomer;
}

export const AuthorizedCustomer = createParamDecorator(
  (data: keyof CustomerAccount, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    return data ? user[data] : user;
  },
);
