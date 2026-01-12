import {
  Body,
  Controller,
  Get,
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
import {
  LocationUpdateDto,
  LocationUpdateResponseDto,
} from "./dto/location-update.dto";
import { LocationGuard } from "src/access/guard/location.guard";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { Scopes } from "src/access/decorator/scopes.decorator";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger/dist/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "src/minio/file.model";
import { NotFoundDto, UnAuthorizedDto } from "src/shared/dto/errors.dto";
import { CreateLocationResponseDto } from "src/address/dto/create.dto";
import { LocationsDto } from "./dto/locations.dto";
import { LocationFirstDto } from "./dto/location-first.dto";
// import { LocationDeleteDto } from "./dto/location-delete.dto";
import { GlobalSuccessDto } from "src/shared/dto/global.dto";
import { UploadAvatarDto } from "src/shared/dto/file-uploaddto";
import { LocationUsersDto } from "./dto/location-users.dto";
import { LocationUserDto } from "./dto/location-user.dto";
import {
  LocationActivateDto,
  LocationActivateResponseDto,
} from "./dto/location-activate.dto";

@ApiTags("Локации")
@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Создание локации" })
  @ApiBody({ type: LocationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "success",
    type: CreateLocationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("location")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("location:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: LocationDto, @Authorized("id") userId, @Req() req) {
    const companyId = req.user.companyId;
    return this.locationService.create(dto, userId, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Список локации компании" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    isArray: true,
    type: LocationsDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("locations")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("locations:read")
  @HttpCode(HttpStatus.OK)
  getLocations(@Req() req) {
    const companyId = req.user.companyId;
    return this.locationService.getAll(companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Информаци о локации" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: LocationFirstDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @Get("location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:read")
  @HttpCode(HttpStatus.OK)
  getOne(@Param("location_id") location_id: string) {
    return this.locationService.getOne(location_id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Редактировать информацию о локации" })
  @ApiBody({ type: LocationUpdateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: LocationUpdateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: "Список сотрудников" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: LocationUsersDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @Get("location/:location_id/users")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:users")
  @HttpCode(HttpStatus.OK)
  getUsers(@Param("location_id") location_id: string) {
    return this.locationService.findUsers(location_id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Информация о сотруднике" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: LocationUserDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @Get("/location/:location_id/user/:user_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:user")
  @HttpCode(HttpStatus.OK)
  firstUser(
    @Param("user_id") userId: string,
    @Param("location_id") locationId: string,
  ) {
    return this.locationService.getFirstUser(userId, locationId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Активировать/деактивировать локацию" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: LocationActivateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @Post("location/:location_id/status")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("location:delete")
  @HttpCode(HttpStatus.OK)
  changeStatus(
    @Body() dto: LocationActivateDto,
    @Param("location_id") location_id: string,
  ) {
    return this.locationService.changeStatus(dto, location_id);
  }

  // @ApiBearerAuth()
  // @ApiOperation({ summary: "Удаление локации" })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "success",
  //   type: LocationDeleteDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: "unauthorized",
  //   type: UnAuthorizedDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: "not found",
  // })
  // @Delete("location/:location_id")
  // @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  // @Scopes("location:delete")
  // @HttpCode(HttpStatus.OK)
  // delete(@Param("location_id") location_id: string) {
  //   return this.locationService.delete(location_id);
  // }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Загрузить аватар" })
  @ApiBody({ type: UploadAvatarDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: GlobalSuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
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
