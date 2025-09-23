import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthPhoneDto } from "./dto/auth-phone.dto";
import { Ip } from "src/shared/decorators/ip.decorator";
import { RefreshRequestDto } from "./dto/refresh.dto";
import { AuthVerifyDto } from "./dto/auth-verify.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("send-code")
  sendCode(@Body() dto: AuthPhoneDto) {
    return this.authService.sendCode(dto);
  }

  @Post("verify-code")
  verifyCode(@Body() data: AuthVerifyDto, @Ip() userIp) {
    return this.authService.verifyCode(data, userIp);
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshRequestDto, @Ip() userIp: string) {
    return this.authService.refreshTokens(
      dto.refresh_token,
      dto.old_token,
      userIp,
    );
  }
}
