import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleDto } from "./dto/schedule.dto";
import { ApiTags } from "@nestjs/swagger/dist/decorators";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { LocationGuard } from "src/access/guard/location.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { ScheduleIdsDto } from "./dto/schedule-ids.dto";

@ApiTags("Расписание")
@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post("/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("schedule:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: ScheduleDto, @Param("location_id") locationId: string) {
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

  @Get("/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("schedule:first")
  @HttpCode(HttpStatus.OK)
  findById(
    @Param("location_id") location_id: string,
    @Body() dto: ScheduleIdsDto,
  ) {
    const { user_id, schedule_id } = dto;
    return this.scheduleService.findById(user_id, schedule_id, location_id);
  }

  @Patch("/:location_id/schedule/:schedule_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("schedule:update")
  @HttpCode(HttpStatus.OK)
  update(
    @Body() dto: ScheduleDto,
    @Param("location_id") location_id: string,
    @Param("schedule_id") schedule_id: string,
  ) {
    return this.scheduleService.update(dto, location_id, Number(schedule_id));
  }

  @Delete("/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("schedule:delete")
  @HttpCode(HttpStatus.OK)
  delete(
    @Param("location_id") location_id: string,
    @Body() dto: ScheduleIdsDto,
  ) {
    const { user_id, schedule_id } = dto;
    return this.scheduleService.delete(user_id, schedule_id, location_id);
  }
}
