import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";
import type { Request } from "express";

interface RequestWithUser extends Request {
  user: User;
}

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    return data ? user[data] : user;
  },
);
