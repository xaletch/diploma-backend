import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthPhoneDto } from "./dto/auth-phone.dto";
import { Ip } from "src/shared/decorators/ip.decorator";
import { RefreshRequestDto } from "./dto/refresh.dto";
import { AuthVerifyDto } from "./dto/auth-verify.dto";
import { Response } from "express";
import { IS_DEV_ENV, SAME_SITE } from "src/shared/utils/is-dev";
import { Authorization } from "./decorators/auth.decorator";

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

  @Authorization()
  @Post("refresh")
  async refresh(
    @Body() dto: RefreshRequestDto,
    @Ip() userIp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.refreshTokens(
        dto.refresh_token,
        dto.old_token,
        userIp,
      );

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: !IS_DEV_ENV,
      sameSite: SAME_SITE,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }
}
