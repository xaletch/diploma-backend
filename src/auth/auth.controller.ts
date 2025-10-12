import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Ip } from "src/shared/decorators/ip.decorator";
import { RefreshRequestDto } from "./dto/refresh.dto";
import { Response } from "express";
import { IS_DEV_ENV, SAME_SITE } from "src/shared/utils/is-dev";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto, @Ip() userIp) {
    return this.authService.register(dto, userIp);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto, @Ip() userIp) {
    return this.authService.login(dto, userIp);
  }

  // old auth
  // @Post("send-code")
  // sendCode(@Body() dto: AuthPhoneDto) {
  //   return this.authService.sendCode(dto);
  // }

  // @Post("verify-code")
  // verifyCode(@Body() data: AuthVerifyDto, @Ip() userIp) {
  //   return this.authService.verifyCode(data, userIp);
  // }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
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
