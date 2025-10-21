import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { ApiTags } from "@nestjs/swagger";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { LocationGuard } from "src/access/guard/location.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { AuthGuard } from "src/auth/guard/auth.guard";

@ApiTags("Расписание")
@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post("/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("schedule:create")
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: ScheduleCreateDto,
    @Param("location_id") locationId: string,
  ) {
    return this.scheduleService.create(dto, locationId);
  }

  @Get("/:user_id/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("schedule:all")
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param("user_id") userId: string,
    @Param("location_id") locationId: string,
  ) {
    return this.scheduleService.findAll(userId, locationId);
  }
}
