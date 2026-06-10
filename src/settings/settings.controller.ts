import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UnAuthorizedDto } from "src/shared/dto/errors.dto";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { UpdatePagesDto } from "./dto/page.dto";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Настройка страниц" })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("page")
  @UseGuards(AuthGuard, LoadUserGuard)
  @HttpCode(HttpStatus.OK)
  changePage(@Body() dto: UpdatePagesDto, @Authorized("id") userId: string) {
    return this.settingsService.pageVisible(dto, userId);
  }
}
