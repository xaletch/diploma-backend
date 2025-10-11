import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationDto } from "./dto/location.dto";
import { LocationUpdateDto } from "./dto/location-update.dto";
import { LocationGuard } from "src/access/guard/location.guard";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { Scopes } from "src/access/decorator/scopes.decorator";

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post("location/:company_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("location:create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: LocationDto,
    @Authorized("id") userId,
    @Param("company_id") companyId: string,
  ) {
    return this.locationService.create(dto, userId, companyId);
  }

  @Get("locations/:company_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("locations:read")
  @HttpCode(HttpStatus.OK)
  async getLocations(@Param("company_id") companyId: string) {
    return this.locationService.getAll(companyId);
  }

  @Get("location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:read")
  @HttpCode(HttpStatus.OK)
  async getOne(@Param("location_id") location_id: string) {
    return this.locationService.getOne(location_id);
  }

  @Patch("location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:update")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() dto: LocationUpdateDto,
    @Param("location_id") location_id: string,
  ) {
    return this.locationService.update(dto, location_id);
  }

  @Delete("location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:delete")
  @HttpCode(HttpStatus.OK)
  async delete(@Param("location_id") location_id: string) {
    return this.locationService.delete(location_id);
  }

  @Get("location/users/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:users")
  @HttpCode(HttpStatus.OK)
  async getUsers(@Param("location_id") location_id: string) {
    return this.locationService.findUsers(location_id);
  }
}
