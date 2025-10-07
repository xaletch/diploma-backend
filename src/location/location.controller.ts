import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { LocationDto } from "./dto/location.dto";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Authorization()
  @Post(":company_id")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: LocationDto,
    @Param("company_id") companyId: string,
  ) {
    return this.locationService.create(dto, companyId);
  }

  @Authorization()
  @Get(":company_id")
  @HttpCode(HttpStatus.OK)
  async getLocations(@Param("company_id") companyId: string) {
    return this.locationService.getAll(companyId);
  }

  @Authorization()
  @Get("get/:location_id")
  @HttpCode(HttpStatus.OK)
  async getOne(@Param("location_id") location_id: string) {
    return this.locationService.getOne(location_id);
  }

  @Authorization()
  @Get("users/:location_id")
  @HttpCode(HttpStatus.OK)
  async getUsers(@Param("location_id") location_id: string) {
    return this.locationService.findUsers(location_id);
  }
}
