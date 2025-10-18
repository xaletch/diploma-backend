import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthCustomerGuard } from "../guard/auth.guard";

export function AuthorizationCustomer() {
  return applyDecorators(UseGuards(AuthCustomerGuard));
}
