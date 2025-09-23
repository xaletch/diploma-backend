import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard";

export function Authorization() {
  return applyDecorators(UseGuards(AuthGuard));
}
