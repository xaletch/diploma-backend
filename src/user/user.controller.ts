import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { Authorized } from "src/auth/decorators/authorized.decorator";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get("profile")
  getUser(@Authorized("id") userId: string) {
    return this.userService.findById(userId);
  }
}
