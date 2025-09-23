import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Ip = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return (
    request.headers["x-forwarded-for"] || request.socket?.remoteAddress || null
  );
});
