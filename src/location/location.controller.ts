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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { ApiTags } from "@nestjs/swagger/dist/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "src/minio/file.model";

@ApiTags("Локации")
@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post("location")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("location:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: LocationDto, @Authorized("id") userId, @Req() req) {
    const companyId = req.user.companyId;
    return this.locationService.create(dto, userId, companyId);
  }

  @Get("locations")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("locations:read")
  @HttpCode(HttpStatus.OK)
  getLocations(@Req() req) {
    const companyId = req.user.companyId;
    return this.locationService.getAll(companyId);
  }

  @Get("location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:read")
  @HttpCode(HttpStatus.OK)
  getOne(@Param("location_id") location_id: string) {
    return this.locationService.getOne(location_id);
  }

  @Patch("location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:update")
  @HttpCode(HttpStatus.OK)
  update(
    @Body() dto: LocationUpdateDto,
    @Param("location_id") location_id: string,
  ) {
    return this.locationService.update(dto, location_id);
  }

  @Get("location/users/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:users")
  @HttpCode(HttpStatus.OK)
  getUsers(@Param("location_id") location_id: string) {
    return this.locationService.findUsers(location_id);
  }

  @Get("/location/:location_id/user/:user_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("employee:delete")
  @HttpCode(HttpStatus.OK)
  firstUser(
    @Param("user_id") userId: string,
    @Param("location_id") locationId: string,
  ) {
    return this.locationService.getFirstUser(userId, locationId);
  }

  @Delete("location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:delete")
  @HttpCode(HttpStatus.OK)
  delete(@Param("location_id") location_id: string) {
    return this.locationService.delete(location_id);
  }

  @Post("location/avatar/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.OK)
  upload(
    @UploadedFile() file: BufferedFile,
    @Param("location_id") locationId: string,
  ) {
    return this.locationService.uploadAvatar(file, locationId);
  }
}
