import {
  Body,
  Controller,
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

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post("location/:company_id")
  @UseGuards(AuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: LocationDto,
    @Param("company_id") companyId: string,
  ) {
    return this.locationService.create(dto, companyId);
  }

  @Get("locations/:company_id")
  @UseGuards(AuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  async getLocations(@Param("company_id") companyId: string) {
    return this.locationService.getAll(companyId);
  }

  @Get("location/:location_id")
  @UseGuards(AuthGuard, LocationGuard)
  @HttpCode(HttpStatus.OK)
  async getOne(@Param("location_id") location_id: string) {
    return this.locationService.getOne(location_id);
  }

  @Patch("location/:location_id")
  @UseGuards(AuthGuard, LocationGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() dto: LocationUpdateDto,
    @Param("location_id") location_id: string,
  ) {
    return this.locationService.update(dto, location_id);
  }

  @Get("location/users/:location_id")
  @UseGuards(AuthGuard, LocationGuard)
  @HttpCode(HttpStatus.OK)
  async getUsers(@Param("location_id") location_id: string) {
    return this.locationService.findUsers(location_id);
  }
}
