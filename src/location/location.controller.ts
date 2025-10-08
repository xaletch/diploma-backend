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
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { LocationDto } from "./dto/location.dto";
import { LocationUpdateDto } from "./dto/location-update.dto";

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Authorization()
  @Post("location/:company_id")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: LocationDto,
    @Param("company_id") companyId: string,
  ) {
    return this.locationService.create(dto, companyId);
  }

  @Authorization()
  @Get("locations/:company_id")
  @HttpCode(HttpStatus.OK)
  async getLocations(@Param("company_id") companyId: string) {
    return this.locationService.getAll(companyId);
  }

  @Authorization()
  @Get("location/:location_id")
  @HttpCode(HttpStatus.OK)
  async getOne(@Param("location_id") location_id: string) {
    return this.locationService.getOne(location_id);
  }

  @Authorization()
  @Patch("location/:location_id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() dto: LocationUpdateDto,
    @Param("location_id") location_id: string,
  ) {
    return this.locationService.update(dto, location_id);
  }

  @Authorization()
  @Get("location/users/:location_id")
  @HttpCode(HttpStatus.OK)
  async getUsers(@Param("location_id") location_id: string) {
    return this.locationService.findUsers(location_id);
  }
}
